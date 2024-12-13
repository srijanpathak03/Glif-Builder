const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const leonardoai = require('@api/leonardoai');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);
const cors = require('cors');
require('dotenv').config();
const { getCollections, connect } = require('./mongoConnection');

const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

cloudinary.config({
    cloud_name:'dj3qabx11',
    api_key:'533762782692462',
    api_secret:'YcvSAvEFsEu-rZyhKmLnI3bQ5KQ',
    secure: true
});

leonardoai.auth(process.env.LEONARDOAI_API_KEY);
const ELEVEN_LABS_API_KEY = process.env.ELEVEN_LABS_API_KEY;
const SHOTSTACK_API_KEY = process.env.SHOTSTACK_API_KEY;
const SHOTSTACK_API_URL = 'https://api.shotstack.io/stage/render';
const SHOTSTACK_INGEST_API_URL = 'https://api.shotstack.io/ingest/stage/sources';
const TEMP_DIR = path.join(__dirname, 'temp');
const CAPTION_FILE = 'caption.srt';
const outputFilePath = path.join(TEMP_DIR, 'output_with_subtitles.mp4');
  
async function generateImage(Imgprompt) {
  try {
      const generationResponse = await leonardoai.createGeneration({
          alchemy: false,
          height: 1280,
          modelId: '6b645e3a-d64f-4341-a6d8-7a3690fbf042',
          num_images: 1,
          presetStyle: 'RENDER_3D',
          prompt: Imgprompt,
          width: 720,
          highContrast: false,
          highResolution: true,
          promptMagic: false,
          styleUUID: 'debdf72a-91a4-467b-bf61-cc02bdeb69c6',
      });
      const generationId = generationResponse.data.sdGenerationJob.generationId;
      if (!generationId) throw new Error('No task ID received');
      console.log("Task submitted with ID:", generationId);
      const completedData = await waitForTask(generationId);

      if (completedData && completedData.generated_images && completedData.generated_images.length > 0) {
          console.log(completedData.generated_images[0].url);
          return completedData.generated_images[0].url;
      } else {
          throw new Error('No image URL found in the output');
      }
  } catch (error) {
      throw new Error(`Error in generateImage: ${error.message}`);
  }
}

async function waitForTask(taskId) {
    const maxAttempts = 60; 
    const delayBetweenAttempts = 2000;  

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
            const response = await leonardoai.getGenerationById({ id: taskId });
            const data = response.data.generations_by_pk;
            const status = data.status;
            console.log(`Attempt ${attempt + 1}: Task status is '${status}'`);

            if (status === 'COMPLETE') {
                console.log('Task completed successfully.',data);
                return data; 
            } else if (status === 'FAILED') {
                throw new Error('Task failed');
            }
            await new Promise(resolve => setTimeout(resolve, delayBetweenAttempts));
        } catch (error) {
            console.error(`Error checking task status: ${error.message}`);
            throw error;
        }
    }
    throw new Error('Timeout waiting for task completion');
}
async function getAudioDuration(filePath) {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(filePath)) {
        reject(new Error(`File does not exist: ${filePath}`));
        return;
      }
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          reject(new Error(`Error getting audio duration for ${filePath}: ${err.message}`));
        } else {
          const duration = metadata.format.duration;
          resolve(duration);
        }
      });
    });
}
  
//to generate voice from text
async function generateVoiceFromText(story) {
const url = 'https://api.elevenlabs.io/v1/text-to-speech/pNInz6obpgDQGcFmaJgB';
console.log('Story:', story);

try {
    const response = await axios.post(
    url,
    { text: story, model_id: "eleven_multilingual_v2" },
    {
        headers: {
        "xi-api-key": ELEVEN_LABS_API_KEY,
        "Content-Type": "application/json",
        },
        responseType: 'arraybuffer',
        }
    );
    if (response.status !== 200) {
        throw new Error(`Failed to generate voice: ${response.statusText}`);
    }
    const audioPath = 'output.mp3';
    fs.writeFileSync(audioPath, response.data);
    console.log('Audio saved locally at:', audioPath);

    // const duration = await getAudioDuration(audioPath);
    // console.log('Audio duration:', duration);

    const result = await cloudinary.uploader.upload(audioPath, {
    resource_type: 'video',
    });

    fs.unlinkSync(audioPath);
    console.log('Local audio file deleted');
    return { audioUrl: result.secure_url};
} catch (error) {
    console.error('Error processing audio:', error.message);
    return null;
}
}
async function downloadFile(url, outputPath) {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
  
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);
  
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
}
  
async function generateSubtitles(audioUrl) {
    try {
        if (!fs.existsSync(TEMP_DIR)) {
            fs.mkdirSync(TEMP_DIR, { recursive: true });
        }
      const response = await axios.post(
        SHOTSTACK_INGEST_API_URL,
        {
          url: audioUrl,
          outputs: {
            transcription: {
              format: 'srt'
            }
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': SHOTSTACK_API_KEY
          }
        }
      );
      const sourceId = response.data.data.id;
      console.log('Subtitle generation initiated with ID:', sourceId);
      let status = 'queued';
      let subtitleUrl = null;
      const maxAttempts = 30;
      let attempts = 0;
  
      while (status !== 'ready' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 5000)); 
        const statusResponse = await axios.get(
          `${SHOTSTACK_INGEST_API_URL}/${sourceId}`,
          {
            headers: {
              'Accept': 'application/json',
              'x-api-key': SHOTSTACK_API_KEY
            }
          }
        );
        status = statusResponse.data.data.attributes.outputs?.transcription?.status || 'processing';
        if (status === 'ready') {
          subtitleUrl = statusResponse.data.data.attributes.outputs.transcription.url;
        }
        attempts++;
      }
      if (!subtitleUrl) {
        throw new Error('Failed to generate subtitles');
      }
      const srtResponse = await axios.get(subtitleUrl);
      fs.writeFileSync(CAPTION_FILE, srtResponse.data);
      console.log('Subtitles downloaded and saved to caption.srt',CAPTION_FILE);
      return CAPTION_FILE;
    } catch (error) {
      console.error('Error generating subtitles:', error);
      throw error;
    }
}

function addSubtitlesToVideo(intermediateOutput) {
    return new Promise((resolve, reject) => {
        const escapedSubtitlePath = CAPTION_FILE.replace(/\\/g, '/');
      ffmpeg(intermediateOutput)
        .outputOptions('-vf', `subtitles=${escapedSubtitlePath}:force_style='Alignment=2,MarginV=70,FontName=Montserrat-Bold,FontSize=8,Bold=1,PrimaryColour=&HFFFFFF,BorderStyle=0,Outline=0,Shadow=0,Spacing=0.2'`)
        .on('start', function(commandLine) {
          console.log('FFmpeg process started:', commandLine);
        })
        .on('end', function() {
          console.log('Subtitles added successfully. The video is ready.');
          resolve(outputFilePath);
        })
        .on('error', function(err) {
          console.log('Error:', err);
          reject(err);
        })
        .save(outputFilePath);
    });
  }

async function uploadImageToCloudinary(imageUrl) {
try {
const result = await cloudinary.uploader.upload(imageUrl, {
  resource_type: "image",
  folder: "slideshow-images",
});
return result.public_id;
} catch (error) {
console.error("Error uploading image to Cloudinary:", error);
throw error;
}
}

async function createVideo(imageSources, audioDuration, topic, height, width) {
try {
console.log("Starting slideshow creation...");
console.log("Uploading images to Cloudinary...");
const publicIds = await Promise.all(
  imageSources.map(imageUrl => uploadImageToCloudinary(imageUrl))
);
console.log("Uploaded image public IDs:", publicIds);
const manifestJson = {
  w: 1080,
  h: 1920,
  du: audioDuration,
  vars: {
    sdur: (audioDuration * 1000) / imageSources.length, 
    tdur: 100, 
    slides: publicIds.map(publicId => ({ media: `i:${publicId}`}))
  }
};
console.log("Creating slideshow with manifest:", JSON.stringify(manifestJson, null, 2));
const result = await cloudinary.uploader.create_slideshow({
  manifest_json: JSON.stringify(manifestJson),
  resource_type: "video",
  folder: "slideshows",
  public_id: `${topic.toLowerCase().replace(/\s+/g, '-')}-slideshow-${Date.now()}`,
});

console.log("Cloudinary response:", result);

if (!result.public_id) {
  throw new Error("Failed to get public_id from Cloudinary response");
}

return {
  publicId: result.public_id,
  batchId: result.batch_id,
  url: result.secure_url
};

} catch (error) {
console.error("Error creating video:", error);
throw error;
}
}

async function uploadVideoToCloudinary(videoPath) {
try {
const result = await cloudinary.uploader.upload(videoPath, {
  resource_type: "video",
  folder: "final-videos",
  public_id: `final-video-${Date.now()}`,
});
console.log("Video uploaded to Cloudinary:", result.secure_url);
return result.secure_url;
} catch (error) {
console.error("Error uploading video to Cloudinary:", error);
throw error;
}
}
async function combineVideoWithAudio(videoUrl, audioUrl) {
try {
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}
const tempVideoPath = path.join(TEMP_DIR, `temp_video_${Date.now()}.mp4`);
const tempAudioPath = path.join(TEMP_DIR, `temp_audio_${Date.now()}.mp3`);
const intermediateOutput = path.join(TEMP_DIR, `intermediate.mp4`);
const finalOutput = path.join(TEMP_DIR, `final_video_${Date.now()}.mp4`);
if (!fs.existsSync(CAPTION_FILE)) {
  throw new Error('Subtitle file not found: ' + CAPTION_FILE);
}
console.log('Downloading video and audio files...');
await Promise.all([
  downloadFile(videoUrl, tempVideoPath),
  downloadFile(audioUrl, tempAudioPath)
]);
console.log('Combining video and audio...');
await new Promise((resolve, reject) => {
  ffmpeg()
    .input(tempVideoPath)
    .input(tempAudioPath)
    .outputOptions([
      '-c:v copy',
      '-c:a aac',
      '-map 0:v:0',
      '-map 1:a:0',
      '-shortest'
    ])
    .output(intermediateOutput)
    .on('end', resolve)
    .on('error', reject)
    .run();
});
console.log('Adding subtitles...');
await addSubtitlesToVideo(intermediateOutput);

console.log('Uploading final video to Cloudinary...');
const cloudinaryUrl = await uploadVideoToCloudinary(outputFilePath);

try {
  fs.unlinkSync(tempVideoPath);
  fs.unlinkSync(tempAudioPath);
  fs.unlinkSync(intermediateOutput);
  fs.unlinkSync(outputFilePath); 
} catch (cleanupError) {
  console.warn('Warning: Error cleaning up temporary files:', cleanupError);
}
console.log('Process completed. Final video URL:', cloudinaryUrl);
return {
  status: "ready",
  url: cloudinaryUrl
};
} catch (error) {
console.error("Error in video processing:", error);
throw error;
}
}
async function combineVideoWithMusic(videoUrl, audioUrl) {
try {
if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}
const tempVideoPath = path.join(TEMP_DIR, `temp_video_${Date.now()}.mp4`);
const tempAudioPath = path.join(TEMP_DIR, `temp_audio_${Date.now()}.mp3`);
const intermediateOutput = path.join(TEMP_DIR, `intermediate.mp4`);

console.log('Downloading video and audio files...');
await Promise.all([
  downloadFile(videoUrl, tempVideoPath),
  downloadFile(audioUrl, tempAudioPath)
]);

console.log('Combining video and audio...');
await new Promise((resolve, reject) => {
  ffmpeg()
    .input(tempVideoPath)
    .input(tempAudioPath)
    .outputOptions([
      '-c:v copy',
      '-c:a aac',
      '-map 0:v:0',
      '-map 1:a:0',
      '-shortest'
    ])
    .output(intermediateOutput)
    .on('end', resolve)
    .on('error', reject)
    .run();
});

console.log('Uploading final video to Cloudinary...');
const cloudinaryUrl = await uploadVideoToCloudinary(intermediateOutput);

// Cleanup temporary files
try {
  fs.unlinkSync(tempVideoPath);
  fs.unlinkSync(tempAudioPath);
  fs.unlinkSync(intermediateOutput);
} catch (cleanupError) {
  console.warn('Warning: Error cleaning up temporary files:', cleanupError);
}

console.log('Process completed. Final video URL:', cloudinaryUrl);
return {
  status: "ready",
  url: cloudinaryUrl
};
} catch (error) {
console.error("Error in video processing:", error);
throw error;
}
}
async function checkVideoStatus(publicId, batchId) {
try {
if (!publicId) {
  throw new Error("No publicId provided to checkVideoStatus");
}
try {
  const result = await cloudinary.api.resource(publicId, {
    resource_type: "video",
    type: "upload"
  });
  
  if (result.secure_url) {
    return {
      status: "ready",
      url: result.secure_url
    };
  }
} catch (error) {
  console.log(`Resource check failed for publicId ${publicId}:`, error.message);
  if (error.http_code !== 404) {
    throw error;
  }
}
if (batchId) {
  const batchResult = await cloudinary.api.resource_by_asset_id(batchId);
  return {
    status: "processing",
    progress: batchResult.status
  };
}
return {
  status: "processing",
  message: "Video still processing"
};
} catch (error) {
console.error("Error checking video status:", error);
return {
  status: "processing",
  error: error.message
};
}
}

async function runVideoCreation(imageSources, audioUrl, audioDuration, topic, height, width) {
    try {
      console.log("Starting video creation process...");
      console.log("Generating subtitles from audio...");
      await generateSubtitles(audioUrl);
      const slideshowResult = await createVideo(imageSources, audioDuration, topic, height, width);
      console.log("Slideshow creation initiated:", slideshowResult);
      let status;
      let attempts = 0;
      const maxAttempts = 50;
  
      do {
        await new Promise(resolve => setTimeout(resolve, 5000));
        status = await checkVideoStatus(slideshowResult.publicId, slideshowResult.batchId);
        console.log(`Attempt ${++attempts}: Status -`, status);
        
        if (attempts >= maxAttempts) {
          throw new Error("Maximum polling attempts reached");
        }
      } while (status.status === "processing");
  
      if (status.status === "ready" && status.url) {
        console.log("Slideshow ready, combining with audio...");
        const finalResult = await combineVideoWithAudio(status.url, audioUrl);
        await cloudinary.uploader.destroy(slideshowResult.publicId, { resource_type: 'video' });
        console.log("Final video available at:", finalResult.url);
        return finalResult;
      } else {
        throw new Error("Slideshow processing failed");
      }
    } catch (error) {
      console.error("Error in video creation process:", error);
      throw error;
    }
}
async function runVideoCreationWithMusic(imageSources, audioUrl, audioDuration, topic, height, width) {
    try {
      console.log("Starting video creation process...");
      const slideshowResult = await createVideo(imageSources, audioDuration, topic, height, width);
      console.log("Slideshow creation initiated:", slideshowResult);
      let status;
      let attempts = 0;
      const maxAttempts = 50;
  
      do {
        await new Promise(resolve => setTimeout(resolve, 5000));
        status = await checkVideoStatus(slideshowResult.publicId, slideshowResult.batchId);
        console.log(`Attempt ${++attempts}: Status -`, status);
        
        if (attempts >= maxAttempts) {
          throw new Error("Maximum polling attempts reached");
        }
      } while (status.status === "processing");
  
      if (status.status === "ready" && status.url) {
        console.log("Slideshow ready, combining with audio...");
        const finalResult = await combineVideoWithMusic(status.url, audioUrl);
        await cloudinary.uploader.destroy(slideshowResult.publicId, { resource_type: 'video' });
        console.log("Final video available at:", finalResult.url);
        return finalResult;
      } else {
        throw new Error("Slideshow processing failed");
      }
    } catch (error) {
      console.error("Error in video creation process:", error);
      throw error;
    }
}

//--------------------------------------------------------------Routes-------------------------------------------------------------------
// to handle voice generation
app.post('/audio-generation', async (req, res) => {
const { text } = req.body;

if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid input. "text" is required and must be a string.' });
}
try {
    const result = await generateVoiceFromText(text);
    if (!result) {
    return res.status(500).json({ error: 'Failed to process the text-to-speech request.' });
    }
    // const audioSrc ="https://res.cloudinary.com/dt6ekj5b3/video/upload/v1729100276/agoypb0fnd6hvrl76xjx.mp3";
    const duration = 35.7755;
    res.status(200).json({ audioUrl: result.audioUrl, duration:duration});
    // res.status(200).json({ audioUrl: audioSrc, duration: duration});
} catch (error) {
    console.error('Error in /generate-voice route:', error.message);
    res.status(500).json({ error: 'Internal server error.' });
}
});  

app.post('/chat-completion', async (req, res) => {
    try {
        const { prompt } = req.body;
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 4000,
            temperature: 0.7
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        const output = response.data.choices[0].message.content.trim();
        console.log("Raw output from API without parse:", output);
        // console.log("Raw output from API:", JSON.parse(output));
        // const prompts = JSON.parse(output);
        res.status(200).json(output);
    } catch (error) {
        console.error("Error during chat completion request:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.post('/generate-images-leonardo', async (req, res) => {
    try {
        const imagePrompts  = req.body;
        console.log('Received image prompts:', imagePrompts);
        if (!Array.isArray(imagePrompts) || imagePrompts.length === 0) {
            return res.status(400).json({ error: 'imagePrompts must be a non-empty array.' });
        }

        console.log('Received image prompts:', imagePrompts);
        
        const imageUrls = [];
        for (let i = 0; i < imagePrompts.length; i++) {
            let prompt = imagePrompts[i].prompt;
            
            if (typeof prompt === 'string') {
                prompt = prompt.trim();
            }

            console.log(`Processing prompt ${i + 1}:`, prompt);

            try {
                const imageUrl = await generateImage(prompt);
                if (imageUrl) {
                    imageUrls.push(imageUrl);
                    console.log(`Image ${i + 1} generated successfully:`, imageUrl);
                }
            } catch (error) {
                console.error(`Error generating image ${i + 1}:`, error);
            }
        }

        if (imageUrls.length === 0) {
            return res.status(500).json({ error: 'Failed to generate any images' });
        }
        // const imageUrls = [
        //   'https://cdn.leonardo.ai/users/2a2092c4-7217-41c4-95dd-82a4bed0e333/generations/c8825612-de1c-4d90-a28a-5a03c58233ea/Leonardo_Phoenix_Tabby_Cat_Dad_grey_fluffy_cozy_sweater_caring_0.jpg',
        //   'https://cdn.leonardo.ai/users/2a2092c4-7217-41c4-95dd-82a4bed0e333/generations/fa544511-6cea-44d7-8d61-9fb91572d6e7/Leonardo_Phoenix_Tabby_Cat_Dad_grey_fluffy_cozy_sweater_caring_0.jpg',
        //   'https://cdn.leonardo.ai/users/2a2092c4-7217-41c4-95dd-82a4bed0e333/generations/589caa75-9f66-4bbd-a4ce-8cf27871660a/Leonardo_Phoenix_Tabby_Cat_Dad_grey_fluffy_cozy_sweater_caring_0.jpg',
        //   'https://cdn.leonardo.ai/users/2a2092c4-7217-41c4-95dd-82a4bed0e333/generations/9e9f480e-a937-45b6-bfff-316579bc3333/Leonardo_Phoenix_Tabby_Cat_Dad_grey_fluffy_cozy_sweater_caring_0.jpg',
        //   'https://cdn.leonardo.ai/users/2a2092c4-7217-41c4-95dd-82a4bed0e333/generations/da26cff2-51de-49e9-a19a-f9d5555caaf1/Leonardo_Phoenix_Tabby_Cat_Dad_grey_fluffy_cozy_sweater_caring_0.jpg',
        //   'https://cdn.leonardo.ai/users/2a2092c4-7217-41c4-95dd-82a4bed0e333/generations/f02bdb5b-77bc-4543-b614-9940d08f42c2/Leonardo_Phoenix_Tabby_Cat_Dad_grey_fluffy_cozy_sweater_caring_0.jpg'
        // ]

        console.log('Returning image URLs:', imageUrls);
        return res.json({ imageUrls });
        
    } catch (error) {
        console.error('Error processing image prompts:', error);
        return res.status(500).json({ 
            error: error.message,
            details: error.stack
        });
    }
});

//this is for single image generation
app.post('/generate-image', async (req, res) => {
    try {
      const { imagePrompt, height, width, style, styleUUID } = req.body;
      const image = await generateImage(imagePrompt, height, width, style, styleUUID);
      res.status(200).json(image);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

// narrations wale videos
app.post('/create-video-with-subtitles', async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        const { imageSources, audioSources, height = 720, width = 1280, topic = "cat" } = req.body;
        const imageUrls = imageSources[0]?.imageUrls || [];
        const { audioUrl, audioDuration } = audioSources;

        if (!imageUrls.length || !audioUrl || !audioDuration) {
            return res.status(400).json({ 
                error: 'Missing required parameters',
                details: {
                    hasImages: Boolean(imageUrls.length),
                    hasAudioUrl: Boolean(audioUrl),
                    hasAudioDuration: Boolean(audioDuration)
                }
            });
        }

        const result = await runVideoCreation(imageUrls, audioUrl, audioDuration, topic, height, width);
        res.status(200).json({ message: 'Video created successfully', videoUrl: result.url });
    } catch (error) {
        console.error('Error in video creation:', error);
        res.status(500).json({ error: 'Failed to create video', details: error.message });
    }
});
  
//for video with music only
app.post('/create-video-with-music', async (req, res) => {
const { imageSources, audioUrl, audioDuration, topic, height, width } = req.body;

if (!imageSources || !audioUrl || !audioDuration || !topic || !height || !width) {
    return res.status(400).json({ error: 'Missing required parameters' });
}
try {
    const result = await runVideoCreationWithMusic(imageSources, audioUrl, audioDuration, topic, height, width);
    res.status(200).json({ message: 'Video with music created successfully', videoUrl: result.url });
} catch (error) {
    res.status(500).json({ error: 'Failed to create video with music', details: error.message });
}
});

// for video generation using flux
// app.post('/generate-video-with-flux', async (req, res) => {
//     const { imageSources, audioUrl, audioDuration, topic, height, width } = req.body;
// });

// Save flow
app.post('/api/flows', async (req, res) => {
    try {
        const { name, data } = req.body;
        console.log('Received flow data:', { name, data });

        const { flowsCollection } = await getCollections();
        
        // Check for duplicate names
        const existingFlow = await flowsCollection.findOne({ name });
        if (existingFlow) {
            return res.status(400).json({ error: 'A flow with this name already exists' });
        }

        const result = await flowsCollection.insertOne({
            name,
            data,
            createdAt: new Date()
        });

        console.log('Saved flow with ID:', result.insertedId);

        res.status(201).json({ 
            message: 'Flow saved successfully',
            flowId: result.insertedId 
        });
    } catch (error) {
        console.error('Error saving flow:', error);
        res.status(500).json({ error: 'Failed to save flow' });
    }
});

// Get all flows
app.get('/api/flows', async (req, res) => {
    try {
        const { flowsCollection } = await getCollections();
        const flows = await flowsCollection.find({})
            .sort({ createdAt: -1 }) // Sort by newest first
            .toArray();
            
        res.json(flows);
    } catch (error) {
        console.error('Error fetching flows:', error);
        res.status(500).json({ 
            error: 'Failed to fetch flows',
            details: error.message 
        });
    }
});

connect()
    .then(() => {
        console.log('Connected to MongoDB successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    });

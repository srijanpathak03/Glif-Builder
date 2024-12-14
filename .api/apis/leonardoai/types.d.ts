import type { FromSchema } from 'json-schema-to-ts';
import * as schemas from './schemas';
export type CreateDatasetBodyParam = FromSchema<typeof schemas.CreateDataset.body>;
export type CreateDatasetResponse200 = FromSchema<typeof schemas.CreateDataset.response['200']>;
export type CreateElementBodyParam = FromSchema<typeof schemas.CreateElement.body>;
export type CreateElementResponse200 = FromSchema<typeof schemas.CreateElement.response['200']>;
export type CreateGenerationBodyParam = FromSchema<typeof schemas.CreateGeneration.body>;
export type CreateGenerationResponse200 = FromSchema<typeof schemas.CreateGeneration.response['200']>;
export type CreateLcmGenerationBodyParam = FromSchema<typeof schemas.CreateLcmGeneration.body>;
export type CreateLcmGenerationResponse200 = FromSchema<typeof schemas.CreateLcmGeneration.response['200']>;
export type CreateModelBodyParam = FromSchema<typeof schemas.CreateModel.body>;
export type CreateModelResponse200 = FromSchema<typeof schemas.CreateModel.response['200']>;
export type CreateSvdMotionGenerationBodyParam = FromSchema<typeof schemas.CreateSvdMotionGeneration.body>;
export type CreateSvdMotionGenerationResponse200 = FromSchema<typeof schemas.CreateSvdMotionGeneration.response['200']>;
export type CreateTextureGenerationBodyParam = FromSchema<typeof schemas.CreateTextureGeneration.body>;
export type CreateTextureGenerationResponse200 = FromSchema<typeof schemas.CreateTextureGeneration.response['200']>;
export type CreateUniversalUpscalerJobBodyParam = FromSchema<typeof schemas.CreateUniversalUpscalerJob.body>;
export type CreateUniversalUpscalerJobResponse200 = FromSchema<typeof schemas.CreateUniversalUpscalerJob.response['200']>;
export type CreateVariationNoBgBodyParam = FromSchema<typeof schemas.CreateVariationNoBg.body>;
export type CreateVariationNoBgResponse200 = FromSchema<typeof schemas.CreateVariationNoBg.response['200']>;
export type CreateVariationUnzoomBodyParam = FromSchema<typeof schemas.CreateVariationUnzoom.body>;
export type CreateVariationUnzoomResponse200 = FromSchema<typeof schemas.CreateVariationUnzoom.response['200']>;
export type CreateVariationUpscaleBodyParam = FromSchema<typeof schemas.CreateVariationUpscale.body>;
export type CreateVariationUpscaleResponse200 = FromSchema<typeof schemas.CreateVariationUpscale.response['200']>;
export type Delete3DModelByIdBodyParam = FromSchema<typeof schemas.Delete3DModelById.body>;
export type Delete3DModelByIdMetadataParam = FromSchema<typeof schemas.Delete3DModelById.metadata>;
export type Delete3DModelByIdResponse200 = FromSchema<typeof schemas.Delete3DModelById.response['200']>;
export type DeleteDatasetByIdMetadataParam = FromSchema<typeof schemas.DeleteDatasetById.metadata>;
export type DeleteDatasetByIdResponse200 = FromSchema<typeof schemas.DeleteDatasetById.response['200']>;
export type DeleteElementByIdMetadataParam = FromSchema<typeof schemas.DeleteElementById.metadata>;
export type DeleteElementByIdResponse200 = FromSchema<typeof schemas.DeleteElementById.response['200']>;
export type DeleteGenerationByIdMetadataParam = FromSchema<typeof schemas.DeleteGenerationById.metadata>;
export type DeleteGenerationByIdResponse200 = FromSchema<typeof schemas.DeleteGenerationById.response['200']>;
export type DeleteInitImageByIdMetadataParam = FromSchema<typeof schemas.DeleteInitImageById.metadata>;
export type DeleteInitImageByIdResponse200 = FromSchema<typeof schemas.DeleteInitImageById.response['200']>;
export type DeleteModelByIdMetadataParam = FromSchema<typeof schemas.DeleteModelById.metadata>;
export type DeleteModelByIdResponse200 = FromSchema<typeof schemas.DeleteModelById.response['200']>;
export type DeleteTextureGenerationByIdBodyParam = FromSchema<typeof schemas.DeleteTextureGenerationById.body>;
export type DeleteTextureGenerationByIdMetadataParam = FromSchema<typeof schemas.DeleteTextureGenerationById.metadata>;
export type DeleteTextureGenerationByIdResponse200 = FromSchema<typeof schemas.DeleteTextureGenerationById.response['200']>;
export type Get3DModelByIdBodyParam = FromSchema<typeof schemas.Get3DModelById.body>;
export type Get3DModelByIdMetadataParam = FromSchema<typeof schemas.Get3DModelById.metadata>;
export type Get3DModelByIdResponse200 = FromSchema<typeof schemas.Get3DModelById.response['200']>;
export type Get3DModelsByUserIdBodyParam = FromSchema<typeof schemas.Get3DModelsByUserId.body>;
export type Get3DModelsByUserIdMetadataParam = FromSchema<typeof schemas.Get3DModelsByUserId.metadata>;
export type Get3DModelsByUserIdResponse200 = FromSchema<typeof schemas.Get3DModelsByUserId.response['200']>;
export type GetDatasetByIdMetadataParam = FromSchema<typeof schemas.GetDatasetById.metadata>;
export type GetDatasetByIdResponse200 = FromSchema<typeof schemas.GetDatasetById.response['200']>;
export type GetElementByIdMetadataParam = FromSchema<typeof schemas.GetElementById.metadata>;
export type GetElementByIdResponse200 = FromSchema<typeof schemas.GetElementById.response['200']>;
export type GetGenerationByIdMetadataParam = FromSchema<typeof schemas.GetGenerationById.metadata>;
export type GetGenerationByIdResponse200 = FromSchema<typeof schemas.GetGenerationById.response['200']>;
export type GetGenerationsByUserIdMetadataParam = FromSchema<typeof schemas.GetGenerationsByUserId.metadata>;
export type GetGenerationsByUserIdResponse200 = FromSchema<typeof schemas.GetGenerationsByUserId.response['200']>;
export type GetInitImageByIdMetadataParam = FromSchema<typeof schemas.GetInitImageById.metadata>;
export type GetInitImageByIdResponse200 = FromSchema<typeof schemas.GetInitImageById.response['200']>;
export type GetModelByIdMetadataParam = FromSchema<typeof schemas.GetModelById.metadata>;
export type GetModelByIdResponse200 = FromSchema<typeof schemas.GetModelById.response['200']>;
export type GetTextureGenerationByIdBodyParam = FromSchema<typeof schemas.GetTextureGenerationById.body>;
export type GetTextureGenerationByIdMetadataParam = FromSchema<typeof schemas.GetTextureGenerationById.metadata>;
export type GetTextureGenerationByIdResponse200 = FromSchema<typeof schemas.GetTextureGenerationById.response['200']>;
export type GetTextureGenerationsByModelIdBodyParam = FromSchema<typeof schemas.GetTextureGenerationsByModelId.body>;
export type GetTextureGenerationsByModelIdMetadataParam = FromSchema<typeof schemas.GetTextureGenerationsByModelId.metadata>;
export type GetTextureGenerationsByModelIdResponse200 = FromSchema<typeof schemas.GetTextureGenerationsByModelId.response['200']>;
export type GetUserSelfResponse200 = FromSchema<typeof schemas.GetUserSelf.response['200']>;
export type GetVariationByIdMetadataParam = FromSchema<typeof schemas.GetVariationById.metadata>;
export type GetVariationByIdResponse200 = FromSchema<typeof schemas.GetVariationById.response['200']>;
export type ListElementsResponse200 = FromSchema<typeof schemas.ListElements.response['200']>;
export type ListPlatformModelsResponse200 = FromSchema<typeof schemas.ListPlatformModels.response['200']>;
export type PerformAlchemyUpscaleLcmBodyParam = FromSchema<typeof schemas.PerformAlchemyUpscaleLcm.body>;
export type PerformAlchemyUpscaleLcmResponse200 = FromSchema<typeof schemas.PerformAlchemyUpscaleLcm.response['200']>;
export type PerformInpaintingLcmBodyParam = FromSchema<typeof schemas.PerformInpaintingLcm.body>;
export type PerformInpaintingLcmResponse200 = FromSchema<typeof schemas.PerformInpaintingLcm.response['200']>;
export type PerformInstantRefineBodyParam = FromSchema<typeof schemas.PerformInstantRefine.body>;
export type PerformInstantRefineResponse200 = FromSchema<typeof schemas.PerformInstantRefine.response['200']>;
export type PricingCalculatorBodyParam = FromSchema<typeof schemas.PricingCalculator.body>;
export type PricingCalculatorResponse200 = FromSchema<typeof schemas.PricingCalculator.response['200']>;
export type PromptImproveBodyParam = FromSchema<typeof schemas.PromptImprove.body>;
export type PromptImproveResponse200 = FromSchema<typeof schemas.PromptImprove.response['200']>;
export type PromptRandomResponse200 = FromSchema<typeof schemas.PromptRandom.response['200']>;
export type UploadCanvasInitImageBodyParam = FromSchema<typeof schemas.UploadCanvasInitImage.body>;
export type UploadCanvasInitImageResponse200 = FromSchema<typeof schemas.UploadCanvasInitImage.response['200']>;
export type UploadDatasetImageBodyParam = FromSchema<typeof schemas.UploadDatasetImage.body>;
export type UploadDatasetImageFromGenBodyParam = FromSchema<typeof schemas.UploadDatasetImageFromGen.body>;
export type UploadDatasetImageFromGenMetadataParam = FromSchema<typeof schemas.UploadDatasetImageFromGen.metadata>;
export type UploadDatasetImageFromGenResponse200 = FromSchema<typeof schemas.UploadDatasetImageFromGen.response['200']>;
export type UploadDatasetImageMetadataParam = FromSchema<typeof schemas.UploadDatasetImage.metadata>;
export type UploadDatasetImageResponse200 = FromSchema<typeof schemas.UploadDatasetImage.response['200']>;
export type UploadInitImageBodyParam = FromSchema<typeof schemas.UploadInitImage.body>;
export type UploadInitImageResponse200 = FromSchema<typeof schemas.UploadInitImage.response['200']>;
export type UploadModelAssetBodyParam = FromSchema<typeof schemas.UploadModelAsset.body>;
export type UploadModelAssetResponse200 = FromSchema<typeof schemas.UploadModelAsset.response['200']>;

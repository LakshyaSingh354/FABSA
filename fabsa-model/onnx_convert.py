from optimum.onnxruntime import ORTModelForSequenceClassification
from transformers import AutoTokenizer

model_checkpoint = "sentiment_model"
save_directory = "onnx/"

ort_model = ORTModelForSequenceClassification.from_pretrained(model_checkpoint, export=True)
tokenizer = AutoTokenizer.from_pretrained(model_checkpoint)

ort_model.save_pretrained(save_directory)
tokenizer.save_pretrained(save_directory)

print(f"ONNX model saved in {save_directory}")

# onnx_model = ORTModelForSequenceClassification.from_pretrained("onnx/", file_name='model.onnx')
# tokenizer = AutoTokenizer.from_pretrained("onnx/")

# # Perform inference
# text = "Tesla stocks dropped 42% while [TGT] rallied."

# inputs = tokenizer(text, return_tensors="pt")

# outputs = onnx_model(**inputs)
# predicted_class = int(outputs.logits.argmax())
# print(f"Predicted Sentiment: {predicted_class}")

from onnxruntime.quantization import quantize_dynamic

quantize_dynamic(
    model_input="onnx/model.onnx",
    model_output="onnx/model.quant.onnx",
    per_channel=True
)
print("Quantized model saved to model_quantized.onnx")
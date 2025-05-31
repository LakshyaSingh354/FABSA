import modal
import os

# Define the Modal image with required dependencies
image = (
    modal.Image.debian_slim()
    .pip_install(
        "fastapi",
        "uvicorn",
        "transformers",
        "onnx",
        "optimum",
        "onnxruntime",
        "torch",
        "rapidfuzz",
        "requests",
        "python-dotenv",
        "pandas",
        "scikit-learn",
        "matplotlib"
    )
).add_local_dir('.', '/app', copy=True)

# Mount your project directory (so Modal can see your code and data)
app = modal.App("fabsa-fastapi-app", image=image)

@app.function(image=image)
@modal.asgi_app()
def fastapi_app():
    # Print the directory structure of the app directory
    def print_directory_structure(root_dir):
        for dirpath, dirnames, filenames in os.walk(root_dir):
            level = dirpath.replace(root_dir, '').count(os.sep)
            indent = ' ' * 4 * level
            print(f"{indent}{os.path.basename(dirpath)}/")
            subindent = ' ' * 4 * (level + 1)
            for f in filenames:
                print(f"{subindent}{f}")

    # Example
    print_directory_structure('/app')
    import sys
    sys.path.append("/app")
    from app import app
    return app

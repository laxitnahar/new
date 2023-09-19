import base64

key_id = "AKIASF6AMGBOZG22BIXE"
key_secret = "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"
credentials = f"{key_id}:{key_secret}"
base64_credentials = base64.b64encode(credentials.encode()).decode()

print(base64_credentials)

"""This script is used to migrate users from Clerk to Supabase. It loads environment variables from a .env.local file, creates a Supabase client, and invokes a Supabase function to perform the migration. Note that it will throw some timeout error, but it will still execute the migration properly."""
import supabase
from supabase import create_client, Client
from supabase.client import ClientOptions
import os
import dotenv
import httpx

# check if .env.local exists
env_path = '.env.local'
if not os.path.exists(env_path):
    raise FileNotFoundError(f"Error: {env_path} file not found. Please create one with the necessary environment variables.")

dotenv.load_dotenv(env_path)

print("Environment variables loaded successfully.")
print("Creating Supabase client...")

# supabase: Client = create_client(
#     supabase_url=os.getenv("NEXT_PUBLIC_SUPABASE_URL"),
#     supabase_key=os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
#     options=ClientOptions(
#         postgrest_client_timeout=10,
#         storage_client_timeout=10,
#         schema="public",
#     )
# )

# print("Supabase client created successfully.")

# # print("Invoking Supabase function to migrate Clerk users...")
# # response = supabase.functions.invoke(
# #     "migrate-in-clerk-users",
# #     invoke_options={"body": {"name": "Functions"}}
# # )
# # print("Response from Supabase function:")
# # print(response)

# print("Invoking Supabase function to migrate Clerk users in the background...")

# # By passing headers to trigger an asynchronous background execution, 
# # your function returns a 202 instantly, and Python doesn't wait for the loop to finish.
# response = supabase.functions.invoke(
#     "migrate-in-clerk-users",
#     invoke_options={
#         "body": {"name": "Functions"},
#         "headers": {
#             "Prefer": "respond-async" # <--- Tells Supabase to execute this in the background
#         }
#     }
# )

# print("Migration triggered successfully! Check your Supabase Dashboard logs for progress.")



# 1. Grab your environment credentials
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
# The service role key is required to bypass security gates on the edge function
SUPABASE_SERVICE_ROLE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

# 2. Build the exact endpoint URL for your edge function
# Standard structure: https://<project-ref>.supabase.co/functions/v1/<function-name>
url = f"{SUPABASE_URL}/functions/v1/migrate-in-clerk-users"

# 3. Setup system authorization and asynchronous execution headers
headers = {
    "Authorization": f"Bearer {SUPABASE_SERVICE_ROLE_KEY}",
    "Content-Type": "application/json",
    # "Prefer": "respond-async" # <-- Tells Supabase to handle the job in the background
}

print("Invoking Supabase function directly via HTTPX with 20-second timeout limits...")

# 4. Use an explicit httpx instance with timeouts disabled (timeout=None)
with httpx.Client(timeout=20) as client:
    try:
        response = client.post(url, headers=headers, json={"name": "Functions"})
        print("Response from Supabase function:")
        print(response.status_code)
        print(response.text)
        
        if response.status_code == 202:
            print("🚀 Success! The Edge Function has accepted the job and is processing the migration in the background.")
            print("You can safely close this terminal and monitor progress via your Supabase Dashboard logs.")
        else:
            print(f"❌ Server replied with status code {response.status_code}: {response.text}")
            
    except httpx.ReadTimeout:
        print("❌ Unexpected Timeout: The server took too long to acknowledge the background request.")
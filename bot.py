import re
import time
def extract_url(text):
    urls = re.findall(r'(https?://\S+)', text)
    return urls[0] if urls else None
import requests

VT_API_KEY = "0c10c75b9757ff6a1bf8ffbf21742d39b6614705a789e68c049e80af429f5f80"

def check_url(url):
    try:
        headers = {"x-apikey": VT_API_KEY}
        submit = requests.post(
            "https://www.virustotal.com/api/v3/urls",
            headers=headers,
            data={"url": url}
        )
        analysis_id = submit.json()["data"]["id"]

        for _ in range(6):
            analysis = requests.get(
                f"https://www.virustotal.com/api/v3/analyses/{analysis_id}",
                headers=headers
            )
            data = analysis.json()["data"]
            if data["attributes"]["status"] == "completed":
                break
            time.sleep(2)

        stats = data["attributes"]["stats"]
        if stats["malicious"] > 0 or stats["suspicious"] > 0:
            return f"⚠️ Dangerous — flagged by {stats['malicious']} security vendor(s)."
        return "✅ No known threats found for this link."
    except Exception as e:
        print("ERROR:", e)
        return "Sorry, something went wrong checking that link."
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters

TOKEN = "8815490517:AAFGGrYhPSdVkyaVLSv7uXhREsDflS0C63k"

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Hi! Send me a suspicious message or link and I'll check it.")

async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_message = update.message.text
    url = extract_url(user_message)

    if url:
        await update.message.reply_text("Checking your link, please wait...")
        result = check_url(url)
        await update.message.reply_text(result)
    else:
        await update.message.reply_text("I couldn't find a link in your message. (Text-only scam checking comes in Phase 4!)")

app = ApplicationBuilder().token(TOKEN).build()

app.add_handler(CommandHandler("start", start))
app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))

print("Bot is running... press Ctrl+C to stop.")
app.run_polling()
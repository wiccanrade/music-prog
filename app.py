from flask import Flask, render_template, request, jsonify, send_file
import openai
import random
import os
import qrcode
from io import BytesIO
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='static')
openai.api_key = os.getenv('OPENAI_API_KEY')

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    try:
        options = request.json
        song = generate_music(options)
        return jsonify({
            'genre': song.genre,
            'lyrics': song.lyrics,
            'melody': song.melody,
            'vocals': song.vocals
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/qr-code', methods=['POST'])
def create_qr_code():
    try:
        data = request.json.get('data')
        img_io = generate_qr_code(data)
        return send_file(img_io, mimetype='image/png')
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def generate_music(options):
    meditation_prompt = f"""
    {options['genre']} tarzında bir meditasyon müziği için:
    - Tema: {options['theme']}
    - Enerji: {options['mood']}
    
    Lütfen şunları içeren bir meditasyon rehberliği oluşturun:
    1. Rahatlatıcı mantralar veya olumlamalar
    2. Nefes egzersizleri için yönergeler
    3. Enerji akışını destekleyici sözler
    4. Şifa ve dönüşüm için pozitif mesajlar
    """
    
    try:
        lyrics_response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": meditation_prompt}]
        )
        meditation_text = lyrics_response.choices[0].message.content

        voice_prompt = f"Meditasyon için {options['genre']} tarzında ana ve destekleyici ses tonu önerileri."
        voice_response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": voice_prompt}]
        )
        voice_content = voice_response.choices[0].message.content.split('\n')
        voices = {
            'male': voice_content[0] if len(voice_content) > 0 else 'Sakin ve Derin Ses',
            'female': voice_content[1] if len(voice_content) > 1 else 'Yumuşak ve Huzurlu Ses'
        }

        melody = generate_meditation_melody()
        
        return Song(options['genre'], meditation_text, melody, voices)
    except Exception as e:
        print(f"Error in generate_music: {str(e)}")
        raise

class Song:
    def __init__(self, genre, lyrics, melody, vocals):
        self.genre = genre
        self.lyrics = lyrics
        self.melody = melody
        self.vocals = vocals

def generate_meditation_melody():
    notes = ['C4', 'D4', 'F4', 'G4', 'A4', 'C5']
    melody = []
    
    for _ in range(16):
        random_note = random.choice(notes)
        melody.append(random_note)
        melody.append('rest')
    
    return ' '.join(melody)

def generate_qr_code(data):
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img_io = BytesIO()
    img.save(img_io, 'PNG')
    img_io.seek(0)
    return img_io

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
import OpenAI from 'openai';
import { GenerationOptions, Song } from '../types/types';
import * as Tone from 'tone';

const openai = new OpenAI({
  apiKey: 'YOUR_OPENAI_API_KEY', // Bu kısmı kendi API anahtarınızla değiştirmelisiniz
  dangerouslyAllowBrowser: true
});

export async function generateMusic(options: GenerationOptions): Promise<Song> {
  // Sözleri oluştur
  const lyricsPrompt = `${options.genre} tarzında, ${options.theme} temalı ve ${options.mood} ruh halinde şarkı sözleri yaz.`;
  const lyricsResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: lyricsPrompt }],
  });

  const lyrics = lyricsResponse.choices[0].message.content || '';

  // Vokal stillerini belirle
  const vocalsPrompt = `${options.genre} tarzı için uygun erkek ve kadın vokal tarzlarını öner.`;
  const vocalsResponse = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: vocalsPrompt }],
  });

  const vocalsContent = vocalsResponse.choices[0].message.content || '';
  const vocals = {
    male: vocalsContent.split('\n')[0] || 'Tenor',
    female: vocalsContent.split('\n')[1] || 'Soprano'
  };

  // Basit bir melodi oluştur
  const synth = new Tone.Synth().toDestination();
  const melody = generateSimpleMelody();

  return {
    genre: options.genre,
    lyrics,
    melody,
    vocals
  };
}

function generateSimpleMelody(): string {
  // Basit bir melodi notası dizisi oluştur
  const notes = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4'];
  const melody = [];
  
  for (let i = 0; i < 8; i++) {
    const randomNote = notes[Math.floor(Math.random() * notes.length)];
    melody.push(randomNote);
  }

  return melody.join(' ');
}
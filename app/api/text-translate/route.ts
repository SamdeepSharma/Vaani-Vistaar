// app/api/translate/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { translate } from 'googletrans';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, target, source } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    const { text: translatedText, src: detectedLanguage } = await translate(text, { from: source, to: target });

    return NextResponse.json({
      translatedText,
      detectedLanguage: source === 'auto' ? detectedLanguage : source
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed' },
      { status: 500 }
    );
  }
}
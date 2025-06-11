generator typescript {
  output_type "typescript"
  output_dir "../"
  version "0.89.0"
}

class Quote {
  quote string
  author string
}

client<llm> Gemini {
  provider google-ai
  options {
    model "gemini-2.0-flash"
    api_key env.GEMINI_API_KEY
  }
}

client<llm> OpenRouter {
  provider openai-generic
  options {
    base_url "https://openrouter.ai/api/v1"
    model "qwen/qwen2.5-vl-3b-instruct:free"
    api_key env.OPENROUTER_API_KEY
  }
}

function ExtractTextFromImage(imageData: image) -> Quote {
  prompt #"
  Extract visible quote from attached image
  {{imageData}}

  Dont use quotes in your response
  {{ ctx.output_format }}
  "#
  client Gemini
}

test TestExtractTextFromImage {
  functions [ExtractTextFromImage]
  args {
    imageData {
      file "./sun-tzu.jpg"
    }
  }
}

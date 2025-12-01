# Advent Calendar Setup Guide

## Folder Structure

Your project should have this structure:

```
adventCalendar/
├── index.html
├── advent.css
├── advent.js
├── imageData.json
├── images/          ← Put your images here
│   ├── day1.jpg
│   ├── day2.jpg
│   └── ...
└── audio/           ← Put your audio files here (optional)
    ├── day1.mp3
    ├── day2.mp3
    └── ...
```

## Step 1: Add Your Images

1. Place all your images in the `images/` folder
2. Name them however you like (e.g., `photo1.jpg`, `surprise.png`, `day1.jpg`)
3. Supported formats: `.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`

## Step 2: Add Your Audio Files (Optional)

1. Place audio files in the `audio/` folder
2. Supported formats: `.mp3`, `.wav`, `.ogg`
3. Not all days need audio - it's optional!

## Step 3: Update imageData.json

Edit `imageData.json` to map each date to your actual files:

```json
{
  "12-01": {
    "image": "your-actual-filename.jpg",
    "audio": "your-audio.mp3", // Optional - remove if no audio
    "description": "Your custom message here"
  },
  "12-02": {
    "image": "another-image.png",
    "description": "Day 2 message"
    // No audio field = no audio for this day
  }
}
```

### JSON Structure Explained:

- **Date Key**: `"12-01"` through `"12-25"` (format: month-day)
- **image** (required): Filename of your image in the `images/` folder
- **audio** (optional): Filename of your audio in the `audio/` folder
- **description** (optional): Text to display in the modal

### Example:

If you have:

- `images/family-photo.jpg`
- `audio/jingle-bells.mp3`

Your JSON entry would be:

```json
"12-01": {
  "image": "family-photo.jpg",
  "audio": "jingle-bells.mp3",
  "description": "Our family Christmas photo!"
}
```

## Step 4: Test It

1. Open `index.html` in a web browser
2. If you're testing locally, you may need to run a local server:

   ```bash
   # Using Python 3
   python3 -m http.server 8000

   # Or using Node.js (if you have http-server installed)
   npx http-server
   ```

3. Then visit `http://localhost:8000` in your browser

## Tips

- **No audio?** Just omit the `"audio"` field from that day's entry
- **No description?** You can omit it, but it's nice to have!
- **File names are case-sensitive** - make sure they match exactly
- **Test with one day first** before adding all 25 days

## Troubleshooting

- **Images not showing?** Check the file path in `imageData.json` matches the actual filename
- **Audio not playing?** Make sure the file format is supported and the path is correct
- **Calendar not loading?** Open browser console (F12) to see any errors

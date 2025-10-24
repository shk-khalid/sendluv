
---

# 🎂 sendLuv – Birthday Celebration App

> An interactive birthday celebration experience with photo overlays, microphone-reactive animations, and confetti! 🎉

[![React](https://img.shields.io/badge/React-19.1.1-61dafb?style=flat\&logo=react)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Storage-3ecf8e?style=flat\&logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Live Demo:** [https://sendluv.vercel.app/](https://sendluv.vercel.app/)

**Repository:** [https://github.com/shk-khalid/sendluv.git](https://github.com/shk-khalid/sendluv.git)

---

## ✨ Features

* 🎤 **Microphone-Reactive Animation** - Cake grows bigger as you sing or blow
* 🎊 **Confetti Celebration** - Confetti effect when max volume is reached
* 📸 **Custom Photo Overlays** - Upload photos that reveal after the celebration
* 🔗 **Shareable Links** - Generate unique links for each birthday person
* 🎨 **Pixel Art Style** - Retro pixel art aesthetics with smooth animations
* 🎵 **Background Music** - Birthday song plays automatically
* 📱 **Responsive Design** - Works on desktop and mobile

---

## 🖼️ How It Works

```
1. Upload Photo → 2. Get Link → 3. Share!
4. Recipient Sings → 5. Confetti! → 6. Photo Reveal!
```

---

## 🚀 Quick Start

### Prerequisites

* Node.js v14+
* npm or yarn
* Supabase account (free tier works)

### Installation

```bash
# Clone repository
git clone https://github.com/shk-khalid/sendluv.git
cd sendluv

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env to add your Supabase credentials
```

### Environment Variables

In `.env`:

```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from: **Supabase Dashboard → Settings → API**

### Start Development Server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Supabase Setup

1. Create a Supabase project
2. Create a storage bucket named `overlays` and make it public
3. Set a policy to allow public access:

```sql
CREATE POLICY "allow_all_overlays"
ON storage.objects
FOR ALL
TO public
USING (bucket_id = 'overlays')
WITH CHECK (bucket_id = 'overlays');
```

---

## 📁 Project Structure

```
sendluv/
├── public/
│   ├── index.html
│   ├── images/              # All image assets
│   │   ├── cake1.png        # Cake animation frames
│   │   ├── cake2.png
│   │   ├── cake3.png
│   │   ├── 20.png - 100.png # Volume-based frames
│   │   └── birthdaytext.png
│   └── audio/
│       └── bdayaudio.mp3    # Birthday song
├── src/
│   ├── components/          # PhotoUpload, PhotoOverlay, Confetti, PixelAnimator
│   ├── pages/               # AdminPage, BirthdayPage
│   ├── App.js               # Router
│   ├── supabaseClient.js    # Supabase init
│   └── index.js
├── .env                     # Environment variables
└── package.json
```

---

## 🎯 Usage

### Admin Interface

**URL:** `http://localhost:3000/`

* Upload photo (max 5MB)
* Link is generated automatically
* Copy and share

### Birthday Interface

**URL:** `http://localhost:3000/celebrate?photo=...`

* Grant microphone access
* Sing or blow to grow cake
* Reach max volume for confetti
* Photo reveal appears
* Background music plays automatically from `public/audio/bdayaudio.mp3`

---

## 🎨 Customization

### Change Cake Images

Replace files in `public/images/`:

* `cake1.png`, `cake2.png`, `cake3.png` – Idle animation frames
* `20.png` – `100.png` – Volume-based frames
* `birthdaytext.png` – Custom overlay

### Adjust Volume Sensitivity

Edit `src/pages/BirthdayPage.js`:

```javascript
const selectCakeFrameByVolume = (volumeLevel) => {
  if (volumeLevel < 0.02) return null;
  if (volumeLevel >= 0.30) return cake20;
  if (volumeLevel >= 0.22) return cake40;
  if (volumeLevel >= 0.15) return cake60;
  if (volumeLevel >= 0.08) return cake80;
  return cake100;
};
```

### Change Confetti

```javascript
<Confetti pieces={48} duration={8000} />
```

### Modify Background Music

Replace `public/audio/bdayaudio.mp3`

---

## 🌐 Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

* Add environment variables in Vercel dashboard
* Live demo: [https://sendluv.vercel.app/](https://sendluv.vercel.app/)

---

## 🔧 Troubleshooting

* **Supabase URL required:** Restart server after editing `.env`
* **Image upload fails (403):** Check bucket policy
* **Image doesn't display:** Verify bucket is public, test URL directly
* **Microphone not working:** Grant permission, HTTPS required in production
* **Confetti not triggering:** Increase microphone sensitivity

---

## 🛠️ Built With

* React 19
* React Router
* Supabase (storage & backend)
* Web Audio API
* Canvas API

---

## 🤝 Contributing

* Fork repo
* Create feature branch
* Commit & push changes
* Open Pull Request

---

## 📄 License

MIT License - see [LICENSE](LICENSE)

---

## 💡 Tips

* Use high-quality square images (max 5MB)
* Sing loudly for best effect
* Test links before sharing

---

## 🐛 Known Issues

* Autoplay may be blocked (user interaction needed)
* Microphone requires HTTPS
* Sensitivity may vary by browser

---

## 📞 Contact

For questions or further information, please contact:

📧 Khalid Shaikh – [shk.khalid18@gmail.com](mailto:shk.khalid18@gmail.com)

📂 Project Repository: [Smart Delivery Management System](https://github.com/shk-khalid/sendluv.git)

---



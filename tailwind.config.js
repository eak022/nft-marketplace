// tailwind.config.js

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // สแกนไฟล์ทั้งหมดที่ใช้ Tailwind CSS ในโปรเจ็กต์ของคุณ
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'), // เรียกใช้ DaisyUI plugin
  ],
  daisyui: {
    themes: ["light", "dark", "cupcake"], // กำหนดธีมที่ต้องการใช้ (สามารถเพิ่มหรือแก้ไขตามความต้องการ)
  },
};

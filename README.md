# Protector of Quran

یہ GitHub Pages + Firebase کے لیے موبائل فرینڈلی ابتدائی Project ہے۔

## 1) Firebase
1. Firebase Console میں Web App بنائیں۔
2. Firestore Database بنائیں۔
3. Authentication اگر استعمال کرنا ہو تو Email/Password provider فعال کریں۔
4. Firebase کی Web App configuration کو `firebase-config.js` میں paste کریں۔

## 2) GitHub Pages
تمام files repository کے root میں upload کریں، پھر:
Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save

## 3) Demo
Firebase config نہ ہونے کی صورت میں site demo mode میں چلتی ہے:
- Admin ID: `admin`
- Password: `admin123`

Demo data browser memory میں رہتا ہے؛ حقیقی multi-device system کے لیے Firebase configuration ضروری ہے۔

## اہم
یہ starter project ہے۔ Production میں passwords کو Firestore میں plain text کے طور پر محفوظ نہ کریں؛ Firebase Authentication استعمال کریں۔

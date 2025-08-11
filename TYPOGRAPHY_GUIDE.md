# 🎨 ADYC Frontend Typography & Text Visibility Guide

## 📍 **Where Typography is Controlled**

### 1. **Main Font Configuration** 
**File:** `/app/frontend/src/index.css` (Lines 1-19)

```css
/* CURRENT FONTS USED */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@400;500;600;700&display=swap');

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
        "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
        "Helvetica Neue", sans-serif;
}
```

**To Change Fonts:**
1. Replace the Google Fonts URL with your preferred fonts
2. Update the `font-family` in the body selector
3. Update font families in typography classes below

---

## 📱 **Typography Classes System**

### **Mobile-First Typography** (Lines 123-194 in index.css)

```css
/* HEADING FONTS - Change font-family here */
.display-text-mobile {
    font-family: 'Playfair Display', serif;  /* 👈 CHANGE THIS */
}

.heading-primary-mobile {
    font-family: 'DM Sans', sans-serif;      /* 👈 CHANGE THIS */
}

.heading-secondary-mobile {
    font-family: 'DM Sans', sans-serif;      /* 👈 CHANGE THIS */
}
```

### **Desktop Typography** (Lines 409-438 in index.css)

```css
.display-text {
    font-family: 'Playfair Display', serif;  /* 👈 CHANGE THIS */
}

.heading-primary {
    font-family: 'DM Sans', sans-serif;      /* 👈 CHANGE THIS */
}

.heading-secondary {
    font-family: 'DM Sans', sans-serif;      /* 👈 CHANGE THIS */
}
```

---

## 🚨 **TEXT VISIBILITY ISSUES IDENTIFIED**

### **Problem Areas:**

#### 1. **Layout.js - Header Text** (Lines 65-68)
```jsx
<h1 className="text-lg sm:text-xl font-bold text-black truncate">ADYC</h1>
<p className="text-xs sm:text-sm text-black opacity-70 leading-tight truncate">
  African Democratic Youth Congress  {/* 👈 opacity-70 makes this hard to read */}
</p>
```

#### 2. **Background Interference** 
In Home.js, floating background elements may interfere with text readability.

#### 3. **Text Color Classes** (Lines 558-566 in index.css)
```css
.text-primary { @apply text-black; }           /* ✅ GOOD */
.text-secondary { @apply text-slate-800; }     /* ✅ GOOD */
.text-accent { @apply text-orange-600; }       /* ✅ GOOD */
```

---

## 🔧 **HOW TO MAKE CHANGES**

### **1. Change Fonts Completely**

**Step 1:** Replace Google Fonts import in `/app/frontend/src/index.css`:
```css
/* Replace line 1 with your preferred fonts */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&family=Open+Sans:wght@400;500;600;700&display=swap');
```

**Step 2:** Update body font-family (line 8):
```css
body {
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

**Step 3:** Update typography classes:
```css
.display-text-mobile {
    font-family: 'Open Sans', serif;  /* For headings */
}

.heading-primary-mobile {
    font-family: 'Roboto', sans-serif;  /* For subheadings */
}
```

### **2. Fix Text Visibility Issues**

**Fix 1:** Remove opacity from header subtitle
```jsx
// In Layout.js, line 66-68, change:
<p className="text-xs sm:text-sm text-black opacity-70 leading-tight truncate">
// TO:
<p className="text-xs sm:text-sm text-slate-800 leading-tight truncate">
```

**Fix 2:** Ensure better contrast by updating text colors:
```css
/* In index.css, update these if needed */
.text-secondary { @apply text-slate-900; }  /* Darker for better visibility */
```

### **3. Font Size Adjustments**

You can modify font sizes in the typography classes:
```css
/* Make text larger for better readability */
.display-text-mobile {
    @apply text-4xl leading-tight;  /* Increase from text-3xl */
}

.body-text-mobile {
    @apply text-base leading-relaxed;  /* Increase from text-sm */
}
```

---

## 📄 **Key Files to Edit**

| File | Purpose | Lines to Focus On |
|------|---------|-------------------|
| `/app/frontend/src/index.css` | Main typography system | 1-19 (fonts), 123-194 (mobile), 409-438 (desktop) |
| `/app/frontend/src/components/Layout.js` | Navigation text | 65-68 (header text) |
| `/app/frontend/src/components/Home.js` | Homepage content | All text content throughout |
| `/app/frontend/src/components/About.js` | About page text | All content |
| `/app/frontend/src/components/Contact.js` | Contact page text | All content |

---

## 🎯 **Quick Fixes for Common Issues**

### **Make All Text More Visible:**
```css
/* Add to index.css */
.enhanced-visibility {
    color: #000000 !important;
    text-shadow: 0 0 1px rgba(0,0,0,0.1);
    font-weight: 500 !important;
}
```

### **Increase Font Sizes Globally:**
```css
/* Add larger base sizes */
.display-text-mobile { @apply text-4xl; }
.heading-primary-mobile { @apply text-3xl; }
.body-text-mobile { @apply text-base; }
```

### **Popular Font Combinations:**
1. **Modern:** Roboto + Open Sans
2. **Professional:** Source Sans Pro + Merriweather  
3. **Friendly:** Nunito + Lato
4. **Elegant:** Montserrat + Source Serif Pro

---

## 🚀 **Implementation Steps**

1. **Backup current index.css**
2. **Choose your fonts** from Google Fonts
3. **Update the import URL** (line 1)
4. **Update body font-family** (line 8)
5. **Update all typography classes** (lines 123-194, 409-438)
6. **Fix visibility issues** in Layout.js and other components
7. **Test on different screen sizes**

---

## 📞 **Need Help?**

If you need specific font recommendations or run into issues, just let me know what style you're going for (modern, professional, playful, etc.) and I can provide exact code changes!
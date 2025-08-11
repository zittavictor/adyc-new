# 🎯 Font Change Examples

## **Example 1: Change to Roboto + Open Sans**

### Step 1: Update Google Fonts Import
Replace line 1 in `/app/frontend/src/index.css`:

```css
/* OLD */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=DM+Sans:wght@400;500;600;700&display=swap');

/* NEW */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700;800&family=Open+Sans:wght@400;500;600;700;800&display=swap');
```

### Step 2: Update Body Font (line 8)
```css
body {
    font-family: 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
}
```

### Step 3: Update Typography Classes
Find these classes in index.css and update:

```css
/* Mobile Typography */
.display-text-mobile {
    @apply text-3xl leading-tight tracking-tight font-bold;
    font-family: 'Open Sans', sans-serif;  /* Changed */
}

.heading-primary-mobile {
    @apply text-2xl leading-tight tracking-tight font-semibold;
    font-family: 'Open Sans', sans-serif;  /* Changed */
}

/* Desktop Typography */
.display-text {
    @apply text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tight;
    font-family: 'Open Sans', sans-serif;  /* Changed */
}

.heading-primary {
    @apply text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight;
    font-family: 'Open Sans', sans-serif;  /* Changed */
}
```

---

## **Example 2: Change to Modern Stack (Montserrat + Source Sans Pro)**

### Step 1: Google Fonts Import
```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Source+Sans+Pro:wght@400;500;600;700&display=swap');
```

### Step 2: Body Font
```css
body {
    font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### Step 3: Typography Classes
```css
.display-text-mobile {
    font-family: 'Montserrat', sans-serif;
}

.heading-primary-mobile {
    font-family: 'Montserrat', sans-serif;
}
```

---

## **Example 3: Improve Visibility Further**

Add these classes to your index.css for enhanced readability:

```css
/* Enhanced visibility utilities */
.text-ultra-visible {
    color: #000000 !important;
    font-weight: 600 !important;
    text-shadow: 0 1px 3px rgba(0,0,0,0.1);
    letter-spacing: 0.01em;
}

.text-high-contrast {
    color: #1a1a1a !important;
    font-weight: 500 !important;
}

/* Apply to specific elements */
.enhanced-header {
    font-size: 1.1em;
    font-weight: 600;
    color: #000000;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
```

Then use in components:
```jsx
<h1 className="enhanced-header">ADYC</h1>
<p className="text-high-contrast">African Democratic Youth Congress</p>
```

---

## **Quick Test: Apply Changes**

1. **Make backup of current index.css**
2. **Choose one example above**  
3. **Apply the changes**
4. **Restart the development server**: `yarn start` in frontend folder
5. **Check visibility on different screen sizes**

---

## **Recommended Font Combinations**

| Style | Heading Font | Body Font | Google Fonts URL |
|-------|-------------|-----------|------------------|
| **Professional** | Montserrat | Source Sans Pro | `family=Montserrat:wght@400;500;600;700;800&family=Source+Sans+Pro:wght@400;500;600;700` |
| **Modern** | Roboto | Open Sans | `family=Roboto:wght@300;400;500;600;700&family=Open+Sans:wght@400;500;600;700` |
| **Friendly** | Nunito | Lato | `family=Nunito:wght@400;500;600;700;800&family=Lato:wght@400;500;600;700` |
| **Clean** | Inter | Inter | `family=Inter:wght@300;400;500;600;700;800` |

Choose one and I can provide the exact implementation code!
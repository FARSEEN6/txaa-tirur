# Admin Navbar Logo Control

## Overview
The goal of allowing the admin to fully control the Navbar logo color and appearance has been achieved. We implemented a system that supports both Image (PNG) and SVG logos with dynamic styling controls.

## Changes Implemented

### 1. Data Schema (`src/types/home.ts`)
- Introduced `LogoSettings` interface:
  - `logoType`: "svg" | "image"
  - `logoMode`: "white" | "black" | "custom" | "original"
  - `logoFilter`: CSS filter string for images
  - `logoColor`: Hex color for SVG or reference
- Added API methods in `src/lib/homeContentService.ts`:
  - `getLogoSettings()`
  - `updateLogoSettings()`

### 2. Admin Interface (`src/pages/admin/home-manager/NavbarLogo.tsx`)
- **Path:** `/admin/home-manager/navbar-logo`
- **Features:**
  - **Type Selection:** Toggle between Image and SVG.
  - **Presets:** Quick buttons for White, Black, Original (no filter), and Custom.
  - **Fine Control:** 
    - For Images: Custom CSS filter input (e.g., `brightness(0) invert(1)`).
    - For SVG: Color picker.
  - **Live Preview:** Real-time visual feedback of how the logo will look on a dark navbar.

### 3. Frontend Integration (`Navbar.tsx`)
- **Real-time Sync:** The Navbar now subscribes to Firebase `layout/logoSettings` using `onValue`. Updates are instant without page reload.
- **Dynamic Styling:** 
  - Applies `filter` style to the logo image tag.
  - Retains fallback to "White" mode if no settings are configured.
- **No Hardcoding:** Removed the static `filter brightness-0 invert` class and replaced it with dynamic style injection.

### 4. Navigation
- Added "Navbar Logo" (Palette icon) to the **Home Manager** dashboard.

## Verification Steps
1. Go to **Admin > Home Manager > Navbar Logo**.
2. Select **"Black"** mode and save.
   - *Result:* The logo in the actual Navbar (top of screen) should turn black immediately.
3. Select **"White"** mode and save.
   - *Result:* Logo turns white.
4. Select **"Original"** mode.
   - *Result:* Logo shows its original colors (if the PNG has color).
5. Select **"Custom"** and inspect the filter field.
   - Try entering `sepia(1)` to see a sepia effect.

## Fallback
If the admin hasn't set any configuration, the Navbar defaults to the **White** logo style (`brightness(0) invert(1)`) to match the dark theme default.

## Build Fixes (Important)
During implementation, we encountered build errors caused by residual Next.js files in `src/app_temp`.
- **Action Taken:** Updated `tsconfig.app.json` to **exclude** `src/app_temp` from the build process.
- **Result:** The project now builds successfully with `npm run build` (Exit Code: 0).
- **Recommendation:** You may safely delete the `src/app_temp` folder in the future as it appears to be a backup from a different framework migration.

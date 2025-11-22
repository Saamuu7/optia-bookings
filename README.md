# ERYCK_STYLE — Sitio web (preparado para producción)

Este repositorio contiene la versión del proyecto lista para personalizar y publicar.

## Project info

**URL**: https://lovable.dev/projects/1ec01f4c-b34b-4603-9b7e-943610f8a74d

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/1ec01f4c-b34b-4603-9b7e-943610f8a74d) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/1ec01f4c-b34b-4603-9b7e-943610f8a74d) and click on Share -> Publish.

---

## Despliegue y publicación (Guía rápida en español)

Resumen: este proyecto genera una app estática (carpeta `dist/`) usando `vite build`. Puedes publicar esos archivos en un hosting estático (Netlify, Vercel, un VPS, cPanel, etc.) y apuntar tu dominio al servidor.

1) Preparar variables de entorno
- Copia `.env.example` a `.env` para desarrollo local.
- Cuando publiques en un host, crea las mismas variables en el panel del host (IMPORTANTE: Vite expone al cliente sólo variables que empiecen por `VITE_`).
- Variables necesarias (cliente): `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`.

2) Build de producción
```powershell
npm run build
```
Esto generará la carpeta `dist/` con los archivos que debes subir al servidor.

3) Previsualizar la build localmente
```powershell
npm run preview
```

4) Hosts recomendados y pasos rápidos
- Vercel: conecta el repo, añade variables `VITE_...` en Settings, build command `npm run build`, publish dir `dist`.
- Netlify: conecta el repo o sube `dist/`, añade variables en Site Settings, build `npm run build`, publish `dist`.
- Host tradicional (VPS/cPanel): sube `dist/` al `public_html`. Asegura un fallback a `index.html` para rutas SPA (ej. reglas de rewrite en Apache o nginx).

5) Dominios y SSL
- En el proveedor de DNS del dominio crea el registro A/CNAME según indica tu host. Muchos hosts configuran SSL automáticamente (Let’s Encrypt) al conectar el dominio.

6) Seguridad y claves
- No pongas claves secretas en variables `VITE_` (son visibles en el navegador). Para operaciones sensibles usa funciones server-side o un backend que mantenga las claves privadas.

7) Compartir localmente vs publicar públicamente
- La URL "network" que Vite muestra durante `dev` permite acceso desde otros dispositivos en tu red local (LAN). No es público en Internet salvo que abras puertos o uses túnel (ngrok).

---

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

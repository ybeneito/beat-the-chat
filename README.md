# 🎮 Beat The Chat

App de quizz dans l'esprit de "1 contre 100" intégrée à Twitch.

## 📋 Vue d'ensemble

**V0** : Webhook Twitch + Auth + Page HTML simple pour streamer + Collecte chat  
**V1** : Webapp Angular pour configuration et personnalisation  
**V2** : Module viewer Angular pour personnalisation et récapitulatifs

## 🏗️ Structure du projet

Monorepo avec pnpm workspaces :

```
beat-the-chat/
├── backend/          # Backend Node.js + TypeScript
├── frontend/         # Frontend Angular (V1+)
├── shared/           # Code partagé (types, interfaces, constants)
└── ...
```

## 🚀 Développement

### Prérequis
- Node.js 18+
- pnpm 8+

### Installation
```bash
pnpm install
```

### Lancer le backend
```bash
pnpm dev:backend
```

### Lancer le frontend
```bash
pnpm dev:frontend
```

### Build complet
```bash
pnpm build
```

## 🚀 Déploiement

### Render

Le backend peut être déployé sur Render. Voir [RENDER_SETUP.md](./RENDER_SETUP.md) pour le guide complet.

**Configuration rapide :**
1. Crée un compte sur [render.com](https://render.com)
2. Connecte ton repo GitHub
3. Crée un nouveau Web Service
4. Utilise le fichier `render.yaml` pour la configuration automatique

## 🎯 Roadmap

- [x] V0 : API Quiz en français (QuizAPI v2)
- [ ] V0 : MVP avec page HTML simple
- [ ] V1 : Webapp Angular pour configuration
- [ ] V2 : Module viewer Angular

## 📚 API Utilisée

### QuizAPI v2
Ce projet utilise [QuizAPI v2](https://quizzapi.jomoreschi.fr/) de Jonathan Moreschi pour les questions de quiz en français.

**Attribution requise :** QuizAPI v2 - Jonathan Moreschi (https://quizzapi.jomoreschi.fr/)

**Licence :** PolyForm Noncommercial 1.0.0 - Usage non commercial uniquement

## 📝 License

MIT


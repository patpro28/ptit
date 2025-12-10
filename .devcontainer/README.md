# Next.js Development Container

This development container provides a complete Next.js development environment with all necessary tools and extensions.

## Features

- **Node.js 20 LTS**: Latest long-term support version
- **Pre-configured VS Code Extensions**:
  - ESLint for code linting
  - Prettier for code formatting
  - Tailwind CSS IntelliSense
  - GitHub Copilot
  - Docker support
- **Port Forwarding**: 
  - Port 3000 for Next.js app
  - Port 9229 for Node.js debugging
- **Oh My Zsh**: Enhanced terminal experience
- **Git & GitHub CLI**: Pre-installed version control tools

## Getting Started

1. Open this folder in VS Code
2. Click "Reopen in Container" when prompted (or use Command Palette: "Dev Containers: Reopen in Container")
3. Wait for the container to build and install dependencies
4. Start developing!

## Running the Next.js App

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Linting
npm run lint
```

## Customization

- **Extensions**: Edit `devcontainer.json` to add/remove VS Code extensions
- **Settings**: Modify VS Code settings in the `customizations.vscode.settings` section
- **Dependencies**: Add system packages in the `Dockerfile`
- **Services**: Add additional services (database, redis, etc.) in `docker-compose.yml`

## Debugging

The container is configured for Node.js debugging on port 9229. You can attach the VS Code debugger to debug your Next.js application.

## Tips

- The workspace is mounted with cached consistency for better performance
- All npm packages are installed automatically after container creation
- Changes to devcontainer configuration require rebuilding the container

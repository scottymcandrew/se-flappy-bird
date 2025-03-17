# GitHub Repository Setup Instructions

Follow these steps to create your GitHub repository and publish the game:

## 1. Create a new repository on GitHub

1. Go to [GitHub](https://github.com) and log in to your account
2. Click the "+" icon in the top-right corner and select "New repository"
3. Set the repository name to "se-flappy-bird"
4. Add a description: "A Flappy Bird style game for pre-sales Solutions Engineers"
5. Make the repository public
6. Leave "Initialize this repository with a README" unchecked (since we already have files)
7. Click "Create repository"

## 2. Push your local repository to GitHub

After creating the repository, GitHub will show you commands to push your existing repository. Open your terminal and run:

```bash
cd /Users/scottmcandrew/devel/se-flappy-bird
git remote add origin https://github.com/YOUR_USERNAME/se-flappy-bird.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## 3. Set up GitHub Pages

To make the game playable online:

1. Go to your repository on GitHub
2. Click on "Settings"
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Select "main" branch and "/ (root)" folder
6. Click "Save"

GitHub Pages will begin deploying your site. After a few minutes, your game will be available at:
https://YOUR_USERNAME.github.io/se-flappy-bird/

## 4. Add the screenshot (optional)

After playing the game once:
1. Take a screenshot of the gameplay
2. Save it as "screenshot.png" in the repository folder
3. Push the changes to GitHub:

```bash
git add screenshot.png
git commit -m "Add game screenshot"
git push
```

Your Flappy Sales: Technical Trials game is now published and playable by anyone with the link!
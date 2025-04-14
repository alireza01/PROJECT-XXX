# PowerShell script to update the remote repository and push changes

# Step 1: Check the current branch
git branch

# Step 2: Pull the latest changes
git pull origin $(git branch --show-current)

# Step 3: Stage all changes
git add .

# Step 4: Commit changes with a default message
git commit -m "Update existing files and sync with remote"

# Step 5: Push changes to the remote repository
git push origin $(git branch --show-current)
# Project creation script
# (for Tornado on Heroku)
#
# by Mike Dory | dory.me
# 11.12.11
# modified by Tedb0t | tedbot.com

# --------------------------

# git!
git init

# --------------------------

# set up the pip requirements
touch requirements.txt
echo "Tornado==2.1.1" >> requirements.txt
echo "simplejson" >> requirements.txt
echo "googlemaps" >> requirements.txt
echo "twilio" >> requirements.txt

# set up the Procfile
touch Procfile
echo "web: python server.py" >> Procfile

# --------------------------

echo "Committing to Git"

git add .
git commit -m "Create heroku"

echo "Creating Heroku app & pushing"

heroku create --stack cedar
git push heroku master

echo "All Done!"
# set up the pip requirements
touch requirements.txt
echo "Tornado==2.1.1" >> requirements.txt

# set up the Procfile
touch Procfile
echo "web: python main.py" >> Procfile

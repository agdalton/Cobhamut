@ECHO OFF
heroku git:remote -a cobhamut
ECHO ***********************
git push heroku main:main
ECHO ***********************
ECHO Cobhamut deployed successfully
git config --global user.email "contato@bragamarmoraria.com.br"
git config --global user.name "Marmoraria"
git init
git add .
git commit -m "Compilacao do Sistema Braga"
Compress-Archive -Path dist\* -DestinationPath braga-marmoraria-site-pronto.zip -Force

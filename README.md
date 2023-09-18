<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio
2. Ejecutar el siguiente comando:
```
npm install
```

3. Tener CLI Instalado
```
npm i -g @nest/cli
```

4. Ir a la carpeta 
```
cd Documents/Dev/Projects/Fernando/nestjs/03-pokedex/
```
5. Iniciar el servidor 
```
npm run start:dev
```

6. Abrir docker, tableplus y Levantar la base de datos
```
docker-compose up -d
```

7. Clonar el archivo ___.env.template___ y renombrar la copia a ___.env___

8. Llenar las variables de entorno definidas en __.env__  

9. Iniciar el SEED de pruebas
```
http://localhost:3000/api/v2/seed/
```
## Stack Usado
- MongoDB
- Nest
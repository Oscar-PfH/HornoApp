# HornoApp

HornoApp es una aplicación para la administración y control de asaderas en una panadería.

## Desarrollo

Lista de librerías/frameworks utilizados para el desarrollo de esta aplicación.

* React-Native
* Expo CLI
* Back4app (Parse)

## Getting started

Para generar una copia local de la aplicación debe seguir los siguientes pasos.

### Prerrequisitos

Instalar los siguientes paquetes:
* npm
  ```sh
  npm install npm@latest -g
  ```
* expo CLI
  ```sh
  npm install expo-cli -g
  ```

Necesitará una cuenta en Back4app, crear una nueva base de datos y obtener su ID, la clave JS y el enlace de conexión a la base de datos. Además, tener una cuenta
de Expo y obtener su EAS ID.

### Instalación

1. Clonar el repositorio
  ```sh
  git clone https://github.com/Oscar-PfH/HornoApp.git
  ```
2. Instalar paquetes npm
  ```sh
  npm install
  ```
3. Configurar un archivo .env con los datos de Back4app y Expo.
  ```js
  APP_ID=yourAppId
  JS_KEY=yourJSKey
  SERVER_URL=serverURL
  EAS_ID=yourEASId>
  ```

### Uso
- Pantalla principal

Puede visualizar una lista de items guardados actualmente
<p align="center">
  <img src="https://github.com/Oscar-PfH/HornoApp/blob/ovenb4a/images/main1.PNG" alt="pantalla principal" style="width:200px;"/>
</p>

- Formulario para agregar un cliente

<p align="center">
  <img src="https://github.com/Oscar-PfH/HornoApp/blob/ovenb4a/images/new.PNG" alt="pantalla principal" style="width:200px;"/>
</p>

- Formulario para agregar una asadera

<p align="center">
  <img src="https://github.com/Oscar-PfH/HornoApp/blob/ovenb4a/images/new2.PNG" alt="pantalla principal" style="width:200px;"/>
</p>

- Detalles y edición de clientes

<p align="center">
  <img src="https://github.com/Oscar-PfH/HornoApp/blob/ovenb4a/images/edit1.PNG" alt="pantalla principal" style="width:200px;"/>
</p>

- Detalles y edición de asaderas

<p align="center">
  <img src="https://github.com/Oscar-PfH/HornoApp/blob/ovenb4a/images/edit2.PNG" alt="pantalla principal" style="width:200px;"/>
</p>

- Tabla de registros

Puede visualizar una lista del total de datos obtenidos en un día de trabajo

<p align="center">
  <img src="https://github.com/Oscar-PfH/HornoApp/blob/ovenb4a/images/table.PNG" alt="pantalla principal" style="width:200px;"/>
</p>

import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import legoLogo from '/lego.png'
import 'virtual:uno.css'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://legocss.dev" target="_blank">
      <img src="${legoLogo}" class="logo vanilla" alt="Legocss logo" />
    </a>
    <h1>Hello Lego.css!</h1>
    <p class="read-the-docs">
      Click on the logo to learn more.
    </p>
  </div>
`

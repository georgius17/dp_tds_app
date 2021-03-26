import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Container } from 'react-bootstrap';
import Toolbar from './Components/Toolbar/Toolbar';
import { Routes } from "./Routes/Routes";
import { ToastProvider } from 'react-toast-notifications'

function App() {
  return (
    <ToastProvider>
      <Container fluid>
        <Toolbar></Toolbar>
        <Routes />
      </Container>
    </ToastProvider>
  );
}

export default App;

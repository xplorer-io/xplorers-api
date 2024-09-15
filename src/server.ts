import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import routes from './index';
import cors from 'cors';
import  errorHandler from './middleware/errorMiddleware';

const app: Express = express();

// Logging
app.use(morgan('dev'));

// Parse the request
app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.use(cors());

// Define routes
app.use('/', routes);

app.use(errorHandler);

const httpServer = http.createServer(app);
const PORT: number = Number(process.env.PORT) || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

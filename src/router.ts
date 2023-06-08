import {NextFunction, Request, Response, Router} from 'express';
import HealthCheckController from './controllers/healthcheck';
import {buildContactController} from './builder';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function wrapAsync(fn: Function): any {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };
}

const router = Router();

// register routes
const healthCheckController = new HealthCheckController();
router.get(
  '/health',
  healthCheckController.healthcheck.bind(healthCheckController)
);

const contactController = buildContactController();
router.post(
  '/identify',
  wrapAsync(contactController.addContact.bind(contactController))
);

export default router;

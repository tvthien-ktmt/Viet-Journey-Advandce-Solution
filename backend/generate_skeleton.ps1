$routes = @("auth", "user", "tour", "flight", "hotel", "booking", "admin", "blog")

foreach ($route in $routes) {
    # Create Route file
    $routeFile = "src/routes/$route.routes.ts"
    $routeContent = @"
import { Router } from 'express';
import * as controller from '../controllers/$route.controller';

const router = Router();

router.get('/', controller.getAll);

export default router;
"@
    Set-Content -Path $routeFile -Value $routeContent

    # Create Controller file
    $controllerFile = "src/controllers/$route.controller.ts"
    $controllerContent = @"
import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getAll = async (req: Request, res: Response) => {
    try {
        res.json({ success: true, message: "Endpoint is working for $route", data: [] });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
"@
    Set-Content -Path $controllerFile -Value $controllerContent
}

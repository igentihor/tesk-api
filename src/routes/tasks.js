const express = require('express');
const { validateCreateTask, validateTask } = require('../middleware/validateTask');
const controller = require('../controllers/taskController');

const router = express.Router();

router.post('/', validateCreateTask, controller.createTask);
router.get('/', controller.getTasks);
router.get('/:id', controller.getTaskById);
router.put('/:id', validateTask, controller.updateTask);
router.patch('/:id', validateTask, controller.updateTask);
router.delete('/:id', controller.deleteTask);

module.exports = router;

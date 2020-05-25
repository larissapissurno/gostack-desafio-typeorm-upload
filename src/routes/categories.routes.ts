import { Router } from 'express';
import { getRepository } from 'typeorm';

import Category from '../models/Category';

// import TransactionsRepository from '../repositories/TransactionsRepository';
// import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const categoriesRouter = Router();

categoriesRouter.post('/', async (request, response) => {
  const { title } = request.body;

  const categoriesRepository = getRepository(Category);

  const category = categoriesRepository.create({ title });

  await categoriesRepository.save(category);

  return response.json(category);
});

export default categoriesRouter;

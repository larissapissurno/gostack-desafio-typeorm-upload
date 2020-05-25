import { getCustomRepository, getRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (type !== 'outcome' && type !== 'income') {
      throw new AppError('Inform a valid operation.');
    }

    if (type === 'outcome' && value > total) {
      throw new AppError('The value requested its bigger than total value. 💸');
    }

    let categoryFound = await categoriesRepository.findOne({
      where: {
        title: category,
      },
    });

    if (!categoryFound) {
      categoryFound = categoriesRepository.create({ title: category });
      await categoriesRepository.save(categoryFound);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: categoryFound?.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;

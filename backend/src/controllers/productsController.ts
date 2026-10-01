import { Request, Response, NextFunction } from 'express';
import { getProductsDb, getProductByIdDb, getCategoriesDb } from '../db/postgres';
import { logAuditEvent } from '../db/mongodb';

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const { search, category, q } = req.query;
    const searchTerm = typeof search === 'string' ? search : (typeof q === 'string' ? q : undefined);
    const categoryTerm = typeof category === 'string' ? category : undefined;

    const products = await getProductsDb(searchTerm, categoryTerm);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProductById(req: Request, res: Response, next: NextFunction) {
  try {
    const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(rawId, 10);
    if (isNaN(id)) {
      return res.status(400).json({ error: true, message: 'ID de producto inválido.' });
    }

    const product = await getProductByIdDb(id);
    if (!product) {
      return res.status(404).json({ error: true, message: 'Producto no encontrado.' });
    }

    // Audit Event: PRODUCT_VIEWED
    await logAuditEvent('PRODUCT_VIEWED', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.price
    });

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
}

export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await getCategoriesDb();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
}

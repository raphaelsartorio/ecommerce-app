import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class ProductsService {
  private BRAZILIAN_API = 'http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/brazilian_provider';
  private EUROPEAN_API = 'http://616d6bdb6dacbb001794ca17.mockapi.io/devnology/european_provider';

  async findAll() {
    try {
      const [br, eu] = await Promise.all([
        axios.get(this.BRAZILIAN_API),
        axios.get(this.EUROPEAN_API),
      ]);

      const brProducts = br.data.map((p: any) => ({
        id: `br${p.id}`,
        name: p.nome,
        description: p.descricao,
        category: p.categoria,
        price: parseFloat(p.preco),
        material: p.material,
        departament: p.departamento,
        image: p.imagem,
        provider: 'brazilian',
      }));

      const euProducts = eu.data.map((p: any) => ({
        id: `eu${p.id}`,
        hasdIscount: p.hasDiscount,
        discountValue: p.discountValue,
        name: p.name,
        description: p.description,
        price: parseFloat(p.price),
        image: p.gallery[0],
        provider: 'european',
      }));

      return [...brProducts, ...euProducts];
    } catch (e) {
      console.error('Erro ao buscar produtos:', e);
      throw new Error('Erro ao carregar produtos');
    }
  }
}

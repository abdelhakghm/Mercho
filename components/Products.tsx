
import React, { useState } from 'react';
import { Product, PrintingCost } from '../types';
import { INITIAL_PRODUCTS } from '../services/mockData';
import { calculateProductTotalCost, formatCurrency, calculateProfitMargin } from '../utils/calculations';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    sku: '',
    category: 'Apparel',
    baseCost: 0,
    isPrinted: false,
    sellingPrice: 0,
    stock: 0,
    printingCostDetails: { ink: 0, paper: 0, machine: 0, labor: 0 }
  });

  const handleSaveProduct = () => {
    const newProduct: Product = {
      ...formData as Product,
      id: `p${Date.now()}`,
    };
    setProducts([...products, newProduct]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-emerald-900">Product Catalog</h2>
          <p className="text-emerald-700/60">Manage your items and printing configurations.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-emerald-700 transition-all font-semibold flex items-center gap-2"
        >
          <span>+</span> Add New Product
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          const totalCost = calculateProductTotalCost(product);
          const margin = calculateProfitMargin(product.sellingPrice, totalCost);
          
          return (
            <div key={product.id} className="glass p-6 rounded-3xl border border-white/50 relative group">
              <div className="absolute top-4 right-4 bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                {product.category}
              </div>
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-2xl mb-4">
                {product.category === 'Apparel' ? '👕' : product.category === 'Drinkware' ? '☕' : '📦'}
              </div>
              <h3 className="text-lg font-bold text-emerald-900 mb-1">{product.name}</h3>
              <p className="text-emerald-700/50 text-xs mb-4">SKU: {product.sku}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-700/60">Unit Cost</span>
                  <span className="font-semibold text-emerald-900">{formatCurrency(totalCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-700/60">Selling Price</span>
                  <span className="font-semibold text-emerald-900">{formatCurrency(product.sellingPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-700/60">Margin</span>
                  <span className={`font-bold ${margin > 30 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {margin.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-emerald-50 pt-4">
                <div className="flex flex-col">
                  <span className="text-xs text-emerald-700/40 uppercase font-bold">In Stock</span>
                  <span className="text-sm font-bold text-emerald-800">{product.stock} units</span>
                </div>
                {product.isPrinted && (
                  <div className="flex items-center gap-1 text-emerald-600">
                    <span className="text-xs font-bold uppercase">Printed Item</span>
                    <span className="text-sm">🖨️</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-900/40 backdrop-blur-sm">
          <div className="glass w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">
            <div className="p-8 border-b border-emerald-50 flex justify-between items-center">
              <h3 className="text-xl font-bold text-emerald-900">Configure New Product</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-emerald-400 hover:text-emerald-600 text-2xl">×</button>
            </div>
            
            <div className="p-8 overflow-y-auto max-h-[70vh] space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-700 uppercase">Product Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="e.g. Graphic Hoodie"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-700 uppercase">SKU</label>
                  <input 
                    type="text" 
                    className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="HK-XXXX"
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out bg-emerald-200 rounded-full">
                    <input 
                      type="checkbox" 
                      className="absolute w-6 h-6 bg-white border-2 border-emerald-300 rounded-full appearance-none cursor-pointer checked:translate-x-full checked:bg-emerald-600 checked:border-emerald-600 transition-transform" 
                      onChange={(e) => setFormData({...formData, isPrinted: e.target.checked})}
                    />
                  </div>
                  <span className="text-sm font-semibold text-emerald-800">Requires Printing?</span>
                </label>
              </div>

              {formData.isPrinted && (
                <div className="space-y-4 border border-emerald-100 p-6 rounded-2xl bg-white/40">
                  <h4 className="text-sm font-bold text-emerald-900 uppercase tracking-wider">Printing Cost Breakdown</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {['Ink', 'Paper', 'Machine', 'Labor'].map((comp) => (
                      <div key={comp} className="space-y-1">
                        <label className="text-[10px] font-bold text-emerald-500 uppercase">{comp}</label>
                        <input 
                          type="number" 
                          className="w-full bg-white border border-emerald-50 rounded-lg px-3 py-2 text-sm text-emerald-900 focus:outline-none"
                          placeholder="$0.00"
                          onChange={(e) => {
                            const details = { ...formData.printingCostDetails } as PrintingCost;
                            (details as any)[comp.toLowerCase()] = parseFloat(e.target.value);
                            setFormData({...formData, printingCostDetails: details});
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-700 uppercase">Base Material Cost</label>
                  <input 
                    type="number" 
                    className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-emerald-900"
                    onChange={(e) => setFormData({...formData, baseCost: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-700 uppercase">Selling Price</label>
                  <input 
                    type="number" 
                    className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-emerald-900"
                    onChange={(e) => setFormData({...formData, sellingPrice: parseFloat(e.target.value)})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-700 uppercase">Initial Stock</label>
                  <input 
                    type="number" 
                    className="w-full bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-emerald-900"
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <div className="p-8 border-t border-emerald-50 bg-emerald-50/30 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 rounded-xl text-emerald-700 font-semibold hover:bg-emerald-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProduct}
                className="bg-emerald-600 text-white px-8 py-3 rounded-xl shadow-lg hover:bg-emerald-700 transition-all font-bold"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

import React, { useState, useEffect } from 'react';
import { Plus, Trash, X, Save } from 'lucide-react';
import DishIngredientService from '../../api/service/DishIngredient.service';

const RecipeIngredientEditor = ({ dishId, onSave, onCancel }) => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch existing ingredients when the component mounts
  useEffect(() => {
    if (dishId) {
      fetchIngredients();
    } else {
      // For new dishes, start with an empty ingredient
      setIngredients([{ id: 'new-1', name: '', quantity: 1, unit: 'g' }]);
      setLoading(false);
    }
  }, [dishId]);

  const fetchIngredients = async () => {
    try {
      setLoading(true);
      console.log("Fetching ingredients for dish ID:", dishId);
      
      const response = await DishIngredientService.getDishIngredientsByDishId(dishId);
      console.log("Ingredients API response:", response);
      
      if (response && response.data && response.data.length > 0) {
        console.log("Setting ingredients from API data:", response.data);
        setIngredients(response.data.map(item => ({
          id: item.id,
          name: item.ingredient?.name || item.name || '',
          quantity: item.quantity || 1,
          unit: item.unit || 'g'
        })));
      } else {
        // If no ingredients, start with an empty one
        console.log("No ingredients found, starting with empty template");
        setIngredients([{ id: 'new-1', name: '', quantity: 1, unit: 'g' }]);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching ingredients:', err);
      setError('Không thể tải dữ liệu nguyên liệu. Vui lòng thử lại sau.');
      setIngredients([{ id: 'new-1', name: '', quantity: 1, unit: 'g' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients, 
      { 
        id: `new-${ingredients.length + 1}`, 
        name: '', 
        quantity: 1, 
        unit: 'g' 
      }
    ]);
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = {
      ...newIngredients[index],
      [field]: field === 'quantity' ? Number(value) : value
    };
    setIngredients(newIngredients);
  };

  const handleSubmit = async () => {
    // Filter out any empty ingredients
    const validIngredients = ingredients.filter(i => i.name.trim() !== '');
    
    if (validIngredients.length === 0) {
      setError('Vui lòng thêm ít nhất một nguyên liệu có tên hợp lệ.');
      return;
    }

    try {
      // Format the data for the API
      const formattedIngredients = validIngredients.map(i => ({
        name: i.name.trim(),
        quantity: i.quantity,
        unit: i.unit,
        dishId: dishId
      }));
      
      onSave(formattedIngredients);
    } catch (err) {
      console.error('Error saving ingredients:', err);
      setError('Không thể lưu nguyên liệu. Vui lòng thử lại sau.');
    }
  };

  if (loading) {
    return (
      <div className="p-4 flex justify-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-xl">
      <h3 className="font-medium text-gray-700 mb-4">Nguyên liệu món ăn</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-rose-50 text-rose-700 rounded-lg border border-rose-200">
          {error}
        </div>
      )}

      <div className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <div key={ingredient.id || index} className="flex gap-2 items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Tên nguyên liệu"
                value={ingredient.name}
                onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="w-20">
              <input
                type="number"
                min="0"
                step="1"
                value={ingredient.quantity}
                onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="w-16">
              <select
                value={ingredient.unit}
                onChange={(e) => handleIngredientChange(index, 'unit', e.target.value)}
                className="w-full px-2 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
                <option value="tbsp">muỗng</option>
                <option value="item">cái</option>
              </select>
            </div>
            <button
              onClick={() => handleRemoveIngredient(index)}
              className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
              title="Xóa nguyên liệu"
            >
              <Trash size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 flex justify-between">
        <button
          onClick={handleAddIngredient}
          className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          <Plus size={16} /> Thêm nguyên liệu
        </button>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-1"
          >
            <Save size={16} /> Lưu nguyên liệu
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecipeIngredientEditor;
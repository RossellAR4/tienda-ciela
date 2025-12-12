// BaseRepository.js - PATRÓN REPOSITORY
class BaseRepository {
  constructor(data = []) {
    this.data = data;
    this.nextId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
  }

  findAll() {
    return Promise.resolve([...this.data]);
  }

  findById(id) {
    return Promise.resolve(this.data.find(item => item.id === id));
  }

  create(item) {
    const newItem = { ...item, id: this.nextId++ };
    this.data.push(newItem);
    return Promise.resolve(newItem);
  }

  update(id, updates) {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return Promise.resolve(null);
    
    this.data[index] = { ...this.data[index], ...updates, updatedAt: new Date() };
    return Promise.resolve(this.data[index]);
  }

  delete(id) {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return Promise.resolve(false);
    
    this.data.splice(index, 1);
    return Promise.resolve(true);
  }
}

module.exports = BaseRepository;

module.exports = {
    categoryWithChild: `
        WITH RECURSIVE sub_categories (id) AS (
            SELECT id FROM categories WHERE id = ?
            UNION ALL  
            SELECT c.id FROM sub_categories, categories c
                WHERE parent_id = sub_categories.id
        )
        SELECT id FROM sub_categories
    `
}
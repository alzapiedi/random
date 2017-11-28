class CreateTag < ActiveRecord::Migration[5.1]
  def change
    create_table :tags do |t|
      t.timestamps
      t.string :title
      t.integer :taggable_id
      t.string :taggable_type
    end
  end
end

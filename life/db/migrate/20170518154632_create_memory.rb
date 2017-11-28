class CreateMemory < ActiveRecord::Migration[5.1]
  def change
    create_table :memories do |t|
      t.timestamps
      t.string :content
      t.integer :date
    end
  end
end

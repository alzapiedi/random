class CreateThought < ActiveRecord::Migration[5.1]
  def change
    create_table :thoughts do |t|
      t.timestamps
      t.string :content
    end
  end
end

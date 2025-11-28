#!/bin/bash

# Function to process a directory
process_dir() {
  local dir=$1
  echo "Processing directory: $dir"
  
  find "$dir" -type f \( -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" \) | while read -r file; do
    # Skip hero image
    if [[ "$file" == *"20251119_205040.jpg"* ]]; then
      echo "Skipping hero image: $file"
      continue
    fi

    filename=$(basename -- "$file")
    extension="${filename##*.}"
    filename="${filename%.*}"
    dirpath=$(dirname "$file")
    
    output_file="$dirpath/$filename.webp"
    
    echo "Converting $file to $output_file"
    
    # Resize to max 1024x1024, maintain aspect ratio, convert to webp
    # Using 'convert' as it is available (even if deprecated warning)
    convert "$file" -resize 1024x1024\> -quality 80 "$output_file"
    
    # Remove original
    if [ -f "$output_file" ]; then
      rm "$file"
      echo "Removed $file"
    else
      echo "Failed to convert $file"
    fi
  done
}

# Process assets
process_dir "src/assets"

# Process public folders
process_dir "public"

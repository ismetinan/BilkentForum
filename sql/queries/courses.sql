-- name: ListPostsByCourse :many
SELECT 
  p.id,
  p.author_id,
  p.course_id,
  p.topic,
  p.created_at,
  p.updated_at,
  COALESCE(
    json_agg(
      json_build_object(
        'id', a.id,
        'url', a.file_url,
        'file_name', a.file_name,
        'mime_type', a.mime_type,
        'file_size', a.file_size
      )
    ) FILTER (WHERE a.id IS NOT NULL), '[]'
  ) AS attachments
FROM posts p
LEFT JOIN attachments a ON p.id = a.post_id
WHERE p.course_id = $1
GROUP BY p.id
ORDER BY p.created_at DESC;

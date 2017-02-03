SELECT DISTINCT article.label_id, article.spot_id, label.label_score, COUNT(*) AS 'Num'
FROM (SELECT * FROM label ORDER BY label.label_score DESC) label 
INNER JOIN article 
ON label.label_id = article.label_id 
GROUP BY label.label_id, article.spot_id
ORDER BY `label`.`label_score` DESC LIMIT 10 

import jieba
def lcs_len(x,y):
  """Calculate the length of the longest common subsequence of x and y."""
  m,n = len(x), len(y)
  dp = [[0]*(n+1) for _ in range(m+1)]
  for i in range(1,m+1):
    for j in range(1,n+1):
      if x[i-1] == y[j-1]:
        dp[i][j] = dp[i-1][j-1] + 1
      else:
        dp[i][j] = max(dp[i-1][j], dp[i][j-1])
  return dp[m][n]

reference = "讨论新产品发布计划，确定时间表为六月，分配市场团队设计广告，技术团队开发功能，预算需审批"
hypothesis = "讨论产品发布，六月为时间表，市场团队制做广告，技术团队负责功能开发"
ref_tokens = list(jieba.cut(reference.replace('，', '')))
hyp_tokens = list(jieba.cut(hypothesis.replace('，', '')))
print(f'Reference tokens: {ref_tokens}')
print(f'Hypothesis tokens: {hyp_tokens}')

lcs_length = lcs_len(ref_tokens, hyp_tokens)
print(f'Length of LCS: {lcs_length}')

# Rouge-L score calculation
m,n = len(ref_tokens), len(hyp_tokens)
precision = lcs_length/ n if n > 0 else 0
recall = lcs_length/ m if m > 0 else 0
f1 = (2 * precision * recall) /(precision + recall) if(precision + recall) > 0 else 0
print(f'Rouge-L Precision: {precision:.4f}')
print(f'Rouge-L Recall: {recall:.4f}')
print(f'Rouge-L F1: {f1:.4f}')
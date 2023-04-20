# Print-Info Typescript action

This Github action prints the number of issues and pull requests in a repository.

## Inputs

### `owner-name`

**Required** Name of the owner of the Github repository

### `repository-name`

**Required** Name of the Github repository

### `from-date`

**Required** Date in the `mm/dd/yy` format from which the number of opened pull requests and issues will be calculated

### `github-token`

**Required** Auth token that must be provided for access to Github API

## Outputs

### `total-issues`

Total number of issues in the repository

### `open-issues`

Number of open issues in the repository

### `closed-issues`

Number of closed issues in the repository

### `issues-since-date`

Number of issues opened since given date

### `total-pulls`

Total number of pull requests in the repository

### `open-pulls`

Number of open pull requests in the repository

### `closed-pulls`

Number of closed pull requests in the repository

### `pulls-since-date`

Number of pull requests opened since given date

## Example usage

```yaml
uses: aleksandrlevochkin/print-info@v1.1.0
with:
  owner-name: "actions"
  repository-name: "checkout"
  from-date: "03-20-2023"
  github-token: ${{ secrets.GITHUB_TOKEN }}
```
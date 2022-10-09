module.exports = {
  branches: ['release'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/github',
      {
        assets: ['CHANGELOG.md', 'LICENSE', 'README.md'],
      },
    ],
    [
      '@semantic-release/exec',
      {
        prepareCmd: "sed -i 's/version=${currentRelease.version}/version=${nextRelease.version}/' gradle.properties",
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md', 'gradle.properties'],
        message: 'chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
      },
    ],
  ],
};

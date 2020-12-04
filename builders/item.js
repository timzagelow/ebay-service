module.exports = class build {
    static item;

    static availableQuantity() {
        const obj = build.item.quantity.find(q => q.type === 'active');

        return obj && obj.count ? obj.count: 0;
    }

    static condition(type = 'disc') {
        const obj = build.item.condition.find(c => c.type === type);

        return obj && obj.name ? obj.name : '';
    }

    static artist() {
        if (build.item.artist.first) {
            return [ build.item.artist.first, build.item.artist.last ].join(' ');
        }

        return build.item.artist.last;
    }

    static title() {
        return build.item.titles.join(' / ');
    }

    static duration() {
        if (build.item.media) {
            return build.item.media[0].duration;
        }
    }

    static genre() {
        let itemGenre;

        build.item.genres.forEach(genre => {
            if (!genre.type && genre.name) {
                itemGenre = genre.name;
            }
        });

        return itemGenre;
    }

    static style() {
        for (let i in build.item.genres) {
            let genre = build.item.genres[i];

            if (genre.type && genre.type === 'style' && genre.name) {
                return genre.name;
            }
        }
    }

    static speed() {
        if (build.item.media) {
            return `${build.item.media[0].speed} RPM`;
        }
    }

    static size() {
        if (build.item.media.length) {
            return `${build.item.media[0].size}"`;
        }
    }

    static releaseYear() {
        const obj = build.item.pressing.find(p => p.type === 'releaseYear');

        return obj && obj.text ? obj.text : '';
    }

    static edition() {
        return build.item.pressing.filter(pressing => {
            if (pressing.type === 'edition') {
                return pressing.text;
            }
        });
    }

    static imageUrls() {
        return build.item.images.map(image => {
            return `${process.env.INVENTORY_IMAGE_PATH}/${image.url}`;
        })
    }

    static notes() {
        return build.item.notes.map(note => {
            if (!note.type) {
                return note.text;
            }
        });
    }
};
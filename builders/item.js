module.exports = class build {
    static item;
    static listing;

    static getListing(listingId) {
        let l = {};

        build.item.listing.forEach (listing => {
            if (listing._id === listingId) {
                l = listing;
            }
        });

        return l;
    }

    static availableQuantity() {
        return build.listing.count ? build.listing.count : 0;
    }

    static condition() {
        const obj = build.listing.condition.find(c => !c.type);

        return obj && obj.grade ? obj.grade : '';
    }

    static conditions() {
        return build.listing.condition.map(c => {
            if (c.type && c.type.length) {
                return {
                    name: c.name,
                    type: c.type.charAt(0).toUpperCase() + c.type.slice(1),
                    text: c.text.join(', '),
                }
            }
        });
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

    static genres() {
        return build.item.genres.map(genre => genre.name);
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

    static pressing() {
        let pressings = {};

        build.item.pressing.forEach(p => {
            let type = p.type.charAt(0).toUpperCase() + p.type.slice(1);

            if (!pressings[type]) {
                pressings[type] = [];
            }

            pressings[type].push(p.text);
        });

        for (let type in pressings) {
            if (pressings.hasOwnProperty(type)) {
                pressings[type] = pressings[type].join(', ');
            }
        }

        return pressings;
    }

    static imageUrls() {
        return build.listing.images.map(image => {
            if (image.url) {
                return `${process.env.ITEM_IMAGE_PATH}/${image.url}`;
            }
        });
    }

    static clipUrls() {
        return build.listing.soundclips.map(clip => {
            if (clip.url) {
                return `${process.env.ITEM_CLIP_PATH}/${clip.url}`;
            }
        });
    }

    static notes() {
        let notes = [];

        build.item.notes.forEach(note => {
            if (!note.type) {
                notes.push(note.text);
            }
        });

        return notes;
    }

    static mediaTexts() {
        return build.item.media.map(item => {
            let countStr = item.count > 1 ? `${item.count} x ` : ``;

            return `${countStr}${item.size}" ${item.duration} (${item.speed} RPM)`;
        })
    }
};